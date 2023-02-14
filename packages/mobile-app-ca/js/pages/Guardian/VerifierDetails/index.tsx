import { DIGIT_CODE } from '@portkey/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import VerifierCountdown, { VerifierCountdownInterface } from 'components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { ApprovalType, VerificationType, VerifierInfo, VerifyStatus } from '@portkey/types/verifier';
import GuardianItem from '../components/GuardianItem';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import myEvents from 'utils/deviceEvent';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { useGetCurrentCAContract } from 'hooks/contract';
import { setLoginAccount } from 'utils/guardian';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { GuardiansStatusItem } from '../types';
import { DefaultChainId } from '@portkey/constants/constants-ca/network-test2';
import { request } from '@portkey/api/api-did';
import { verification } from 'utils/api';

type RouterParams = {
  guardianItem?: UserGuardianItem;
  requestCodeResult?: { verifierSessionId: string };
  startResend?: boolean;
  verificationType?: VerificationType;
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
  const {
    guardianItem,
    requestCodeResult: paramsRequestCodeResult,
    startResend,
    verificationType,
  } = useRouterParams<RouterParams>();
  console.log(guardianItem, '=====guardianItem');

  const countdown = useRef<VerifierCountdownInterface>();
  useEffectOnce(() => {
    if (!startResend) countdown.current?.resetTime(60);
  });
  const [requestCodeResult, setRequestCodeResult] =
    useState<RouterParams['requestCodeResult']>(paramsRequestCodeResult);
  const digitInput = useRef<DigitInputInterface>();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();
  const setGuardianStatus = useCallback(
    (status: GuardiansStatusItem) => {
      myEvents.setGuardianStatus.emit({
        key: guardianItem?.key,
        status,
      });
    },
    [guardianItem?.key],
  );
  const onSetLoginAccount = useCallback(async () => {
    if (!managerAddress || !caHash || !guardianItem) return;

    try {
      const caContract = await getCurrentCAContract();
      const req = await setLoginAccount(caContract, managerAddress, caHash, guardianItem);
      if (req && !req.error) {
        myEvents.refreshGuardiansList.emit();
        navigationService.navigate('GuardianDetail', {
          guardian: { ...guardianItem, isLoginAccount: true },
        });
      } else {
        CommonToast.fail(req?.error?.message || '');
      }
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [caHash, getCurrentCAContract, guardianItem, managerAddress]);

  const onFinish = useCallback(
    async (code: string) => {
      if (!requestCodeResult || !guardianItem || !code) return;
      try {
        Loading.show();
        const rst = await request.verify.checkVerificationCode({
          params: {
            type: LoginStrType[guardianItem?.guardianType as LoginType],
            verificationCode: code,
            guardianAccount: guardianItem.guardianAccount,
            ...requestCodeResult,
            verifierId: guardianItem?.verifier?.id,
            chainId: DefaultChainId,
          },
        });
        CommonToast.success('Verified Successfully');

        const verifierInfo: VerifierInfo = {
          ...rst,
          verifierId: guardianItem?.verifier?.id,
        };
        switch (verificationType) {
          case VerificationType.communityRecovery:
          case VerificationType.editGuardianApproval:
            setGuardianStatus({
              requestCodeResult: requestCodeResult,
              status: VerifyStatus.Verified,
              verifierInfo,
            });
            navigationService.goBack();
            break;
          case VerificationType.addGuardian:
            if (verifierInfo.signature && verifierInfo.verificationDoc) {
              navigationService.navigate('GuardianApproval', {
                approvalType: ApprovalType.addGuardian,
                guardianItem,
                verifierInfo,
                verifiedTime: Date.now(),
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
                loginAccount: guardianItem.guardianAccount,
                type: guardianItem.guardianType,
              },
              verifierInfo,
            });
            break;
        }
      } catch (error) {
        CommonToast.failError(error, 'Verify Fail');
        digitInput.current?.reset();
      }
      Loading.hide();
    },
    [requestCodeResult, verificationType, setGuardianStatus, onSetLoginAccount, guardianItem],
  );
  const resendCode = useCallback(async () => {
    Loading.show();
    try {
      const req = await verification.sendVerificationCode({
        params: {
          type: LoginStrType[guardianItem?.guardianType as LoginType],
          guardianAccount: guardianItem?.guardianAccount,
          verifierId: guardianItem?.verifier?.id,
          chainId: DefaultChainId,
        },
      });
      if (req.verifierSessionId) {
        setRequestCodeResult(req);
        setGuardianStatus({
          requestCodeResult: req,
          status: VerifyStatus.Verifying,
        });
        countdown.current?.resetTime(60);
      }
    } catch (error) {
      CommonToast.failError(error, 'Verify Fail');
    }
    digitInput.current?.reset();
    Loading.hide();
  }, [guardianItem?.guardianAccount, guardianItem?.guardianType, guardianItem?.verifier?.id, setGuardianStatus]);
  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      {guardianItem ? <GuardianItem guardianItem={guardianItem} isButtonHide /> : null}
      <TipText
        isRegister={!verificationType || (verificationType as VerificationType) === VerificationType.register}
        guardianAccount={guardianItem?.guardianAccount}
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
