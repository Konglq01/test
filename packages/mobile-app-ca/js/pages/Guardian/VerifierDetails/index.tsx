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
import GuardianAccountItem, { GuardiansStatusItem } from '../components/GuardianAccountItem';
import { FontStyles } from 'assets/theme/styles';
import { request } from 'api';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import myEvents from 'utils/deviceEvent';
import { API_REQ_FUNCTION } from 'api/types';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { useCurrentCAContract } from 'hooks/contract';
import { setLoginAccount } from 'utils/guardian';

type FetchType = Record<string, API_REQ_FUNCTION>;

type RouterParams = {
  loginGuardianType?: string;
  guardianItem?: UserGuardianItem;
  verifierSessionId?: string;
  managerUniqueId?: string;
  startResend?: boolean;
  verificationType?: VerificationType;
  guardianKey?: string;
};

function TipText({ loginGuardianType, isRegister }: { loginGuardianType?: string; isRegister?: boolean }) {
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
      <Text style={FontStyles.font4}>{loginGuardianType}</Text>
      {last}
    </TextM>
  );
}

export default function VerifierDetails() {
  const {
    loginGuardianType,
    guardianItem,
    verifierSessionId,
    managerUniqueId,
    startResend,
    verificationType,
    guardianKey,
  } = useRouterParams<RouterParams>();
  const countdown = useRef<VerifierCountdownInterface>();
  useEffectOnce(() => {
    if (!startResend) countdown.current?.resetTime(60);
  });
  const [stateSessionId, setStateSessionId] = useState<string>(verifierSessionId || '');
  const digitInput = useRef<DigitInputInterface>();
  const setGuardianStatus = useCallback(
    (status: GuardiansStatusItem) => {
      myEvents.setGuardianStatus.emit({
        key: guardianKey,
        status,
      });
    },
    [guardianKey],
  );

  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const caContract = useCurrentCAContract();

  const onSetLoginAccount = useCallback(async () => {
    if (!caContract || !managerAddress || !caHash || !guardianItem) return;

    try {
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
  }, [caContract, caHash, guardianItem, managerAddress]);

  const onFinish = useCallback(
    async (code: string) => {
      if (!stateSessionId || !loginGuardianType || !code) return;
      try {
        Loading.show();
        let fetch: FetchType = request.register;
        if (verificationType === VerificationType.communityRecovery) fetch = request.recovery;
        if (
          verificationType === VerificationType.addGuardian ||
          verificationType === VerificationType.editGuardianApproval ||
          verificationType === VerificationType.setLoginAccount
        ) {
          fetch = request.verification;
        }

        const rst = await fetch.verifyCode({
          baseURL: guardianItem?.verifier?.url,
          data: {
            type: 0,
            code,
            loginGuardianType,
            verifierSessionId: stateSessionId,
          },
        });
        CommonToast.success('Verified Successfully');
        if (verificationType === VerificationType.communityRecovery) {
          setGuardianStatus({
            verifierSessionId: stateSessionId,
            status: VerifyStatus.Verified,
          });
          navigationService.goBack();
        } else if (verificationType === VerificationType.editGuardianApproval) {
          if (rst.signature && rst.verifierDoc) {
            setGuardianStatus({
              verifierSessionId: stateSessionId,
              status: VerifyStatus.Verified,
              editGuardianParams: {
                signature: rst.signature,
                verifierDoc: rst.verifierDoc,
              },
            });
            navigationService.goBack();
          }
        } else if (verificationType === VerificationType.addGuardian) {
          if (rst.signature && rst.verifierDoc) {
            navigationService.navigate('GuardianApproval', {
              approvalType: ApprovalType.addGuardian,
              guardianItem,
              editGuardianParams: {
                signature: rst.signature,
                verifierDoc: rst.verifierDoc,
              },
              managerUniqueId,
            });
          }
        } else if (verificationType === VerificationType.setLoginAccount) {
          await onSetLoginAccount();
        } else {
          navigationService.navigate('SetPin', {
            managerInfo: {
              verificationType: VerificationType.register,
              loginGuardianType,
              type: LoginType.email,
              managerUniqueId,
            },
          });
        }
      } catch (error) {
        CommonToast.failError(error, 'Verify Fail');
        digitInput.current?.reset();
      }
      Loading.hide();
    },
    [
      guardianItem,
      loginGuardianType,
      managerUniqueId,
      setGuardianStatus,
      onSetLoginAccount,
      stateSessionId,
      verificationType,
    ],
  );
  const resendCode = useCallback(async () => {
    Loading.show();
    try {
      let fetch: FetchType = request.register;
      if (verificationType === VerificationType.communityRecovery) fetch = request.recovery;
      if (
        verificationType === VerificationType.addGuardian ||
        verificationType === VerificationType.editGuardianApproval ||
        verificationType === VerificationType.setLoginAccount
      )
        fetch = request.verification;
      const req = await fetch.sendCode({
        baseURL: guardianItem?.verifier?.url,
        data: {
          type: 0,
          loginGuardianType,
          managerUniqueId,
        },
      });
      if (req.verifierSessionId) {
        setStateSessionId(req.verifierSessionId);
        setGuardianStatus({
          verifierSessionId: req.verifierSessionId,
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
  }, [guardianItem?.verifier?.url, loginGuardianType, managerUniqueId, setGuardianStatus, verificationType]);
  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      {guardianItem ? <GuardianAccountItem guardianItem={guardianItem} isButtonHide /> : null}
      <TipText
        isRegister={!verificationType || (verificationType as VerificationType) === VerificationType.register}
        loginGuardianType={loginGuardianType}
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
