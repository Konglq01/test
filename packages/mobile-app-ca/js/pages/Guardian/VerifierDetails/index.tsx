import { DIGIT_CODE } from '@portkey/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import VerifierCountdown, { VerifierCountdownInterface } from 'components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { ApprovalType, VerificationType, VerifyStatus } from '@portkey/types/verifier';
import GuardianItem from '../components/GuardianItem';
import { FontStyles } from 'assets/theme/styles';
import { request } from 'api';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import myEvents from 'utils/deviceEvent';
import { API_REQ_FUNCTION } from 'api/types';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { useGetCurrentCAContract } from 'hooks/contract';
import { setLoginAccount } from 'utils/guardian';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { GuardiansStatusItem } from '../types';

type FetchType = Record<string, API_REQ_FUNCTION>;

type RouterParams = {
  guardianAccount?: string;
  guardianItem?: UserGuardianItem;
  verifierResult?: { verifierSessionId: string; endPoint: string };
  startResend?: boolean;
  verificationType?: VerificationType;
  type?: LoginType;
};
function TipText({ guardianAccount, isRegister }: { guardianAccount?: string; isRegister?: boolean }) {
  const [first, last] = useMemo(() => {
    if (!isRegister)
      return [
        `Please contact your guardians, and enter the ${DIGIT_CODE.length}-digit code sent to `,
        ` within ${DIGIT_CODE.expiration} minutes.`,
      ];
    return [`A ${DIGIT_CODE.length}-digit code was sent to `, ` Enter it within ${DIGIT_CODE.expiration} minutes`];
  }, [isRegister]);
  return (
    <TextM style={[FontStyles.font3, GStyles.marginTop(16), GStyles.marginBottom(50)]}>
      {first}
      <Text style={FontStyles.font4}>{guardianAccount}</Text>
      {last}
    </TextM>
  );
}

export default function VerifierDetails() {
  const { guardianAccount, guardianItem, verifierResult, startResend, verificationType, type } =
    useRouterParams<RouterParams>();
  console.log(guardianAccount, type, '====guardianAccount');

  const countdown = useRef<VerifierCountdownInterface>();
  useEffectOnce(() => {
    if (!startResend) countdown.current?.resetTime(60);
  });
  const [stateVerifierResult, setStateSessionId] = useState<RouterParams['verifierResult']>(verifierResult);
  const digitInput = useRef<DigitInputInterface>();
  const setGuardianStatus = useCallback(
    (status: GuardiansStatusItem) => {
      myEvents.setGuardianStatus.emit({
        key: guardianItem?.key,
        status,
      });
    },
    [guardianItem?.key],
  );

  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();

  const onSetLoginAccount = useCallback(async () => {
    if (!managerAddress || !caHash || !guardianItem) return;

    try {
      const caContract = await getCurrentCAContract();

      const req = await setLoginAccount(caContract, managerAddress, caHash, guardianItem);
      if (req && !req.error) {
        myEvents.refreshGuardiansList.emit();
        navigationService.navigate('GuardianDetail', {
          guardian: JSON.stringify({ ...guardianItem, isLoginAccount: true }),
        });
      } else {
        CommonToast.fail(req?.error.message);
      }
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [caHash, getCurrentCAContract, guardianItem, managerAddress]);

  const onFinish = useCallback(
    async (code: string) => {
      if (!stateVerifierResult || !guardianAccount || !code) return;
      try {
        Loading.show();
        console.log(
          {
            type: LoginStrType[type as LoginType],
            verificationCode: code,
            guardianAccount,
            ...stateVerifierResult,
            verifierId: guardianItem?.verifier?.id,
          },
          '====',
        );

        const rst = await request.verify.verifyCode({
          data: {
            type: LoginStrType[type as LoginType],
            verificationCode: code,
            guardianAccount,
            ...stateVerifierResult,
            verifierId: guardianItem?.verifier?.id,
          },
        });
        console.log(rst, '===rst');

        CommonToast.success('Verified Successfully');

        switch (verificationType) {
          case VerificationType.communityRecovery:
            setGuardianStatus({
              verifierResult: stateVerifierResult,
              status: VerifyStatus.Verified,
              verifierInfo: {
                ...rst,
                verifierId: guardianItem?.verifier?.id,
              },
            });
            navigationService.goBack();
            break;
          case VerificationType.editGuardianApproval:
            if (rst.signature && rst.verifierDoc) {
              setGuardianStatus({
                verifierResult: stateVerifierResult,
                status: VerifyStatus.Verified,
                editGuardianParams: {
                  signature: rst.signature,
                  verifierDoc: rst.verifierDoc,
                },
              });
              navigationService.goBack();
            }
            break;
          case VerificationType.addGuardian:
            if (rst.signature && rst.verifierDoc) {
              navigationService.navigate('GuardianApproval', {
                approvalType: ApprovalType.addGuardian,
                guardianItem,
                editGuardianParams: {
                  signature: rst.signature,
                  verifierDoc: rst.verifierDoc,
                },
              });
            }
            break;
          case VerificationType.setLoginAccount:
            await onSetLoginAccount();
            break;
          default:
            navigationService.navigate('SetPin', {
              managerInfo: {
                verificationType: VerificationType.register,
                loginAccount: guardianAccount,
                type,
              },
              verifierInfo: {
                ...rst,
                verifierId: guardianItem?.verifier?.id,
              },
            });
            break;
        }
      } catch (error) {
        CommonToast.failError(error, 'Verify Fail');
        digitInput.current?.reset();
      }
      Loading.hide();
    },
    [stateVerifierResult, guardianAccount, type, verificationType, setGuardianStatus, onSetLoginAccount, guardianItem],
  );
  const resendCode = useCallback(async () => {
    Loading.show();
    try {
      const req = await request.verify.sendCode({
        data: {
          type: LoginStrType[type as LoginType],
          guardianAccount,
          verifierId: guardianItem?.verifier?.id,
        },
      });
      if (req.verifierSessionId) {
        setStateSessionId(req);
        setGuardianStatus({
          verifierResult: req,
          status: VerifyStatus.Verifying,
        });
        countdown.current?.resetTime(60);
        digitInput.current?.reset();
      }
    } catch (error) {
      digitInput.current?.reset();
      CommonToast.failError(error, 'Verify Fail');
    }
    Loading.hide();
  }, [guardianAccount, guardianItem?.verifier?.id, setGuardianStatus, type]);
  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      {guardianItem ? <GuardianItem guardianItem={guardianItem} isButtonHide /> : null}
      <TipText
        isRegister={!verificationType || (verificationType as VerificationType) === VerificationType.register}
        guardianAccount={guardianAccount}
      />
      <DigitInput ref={digitInput} onFinish={onFinish} maxLength={DIGIT_CODE.length} />
      <VerifierCountdown style={GStyles.marginTop(24)} onResend={resendCode} ref={countdown} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: 8,
  },
});
