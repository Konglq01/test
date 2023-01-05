import { DIGIT_CODE } from '@portkey/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import VerifierCountdown, { VerifierCountdownInterface } from 'components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import React, { useCallback, useRef, useState } from 'react';
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
  const onFinish = useCallback(
    async (code: string) => {
      if (!stateSessionId || !loginGuardianType || !code) return;
      try {
        Loading.show();
        let fetch: FetchType = request.register;
        if (verificationType === VerificationType.communityRecovery) fetch = request.recovery;
        if (
          verificationType === VerificationType.addGuardian ||
          verificationType === VerificationType.editGuardianApproval
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
        digitInput.current?.resetPin();
      }
      Loading.hide();
    },
    [guardianItem, loginGuardianType, managerUniqueId, setGuardianStatus, stateSessionId, verificationType],
  );
  const resendCode = useCallback(async () => {
    Loading.show();
    try {
      let fetch: FetchType = request.register;
      if (verificationType === VerificationType.communityRecovery) fetch = request.recovery;
      if (
        verificationType === VerificationType.addGuardian ||
        verificationType === VerificationType.editGuardianApproval
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
        digitInput.current?.resetPin();
      }
    } catch (error) {
      digitInput.current?.resetPin();
      CommonToast.failError(error, 'Verify Fail');
    }
    Loading.hide();
  }, [guardianItem?.verifier?.url, loginGuardianType, managerUniqueId, setGuardianStatus, verificationType]);
  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      {guardianItem ? <GuardianAccountItem guardianItem={guardianItem} isButtonHide /> : null}
      <TextM style={[FontStyles.font3, GStyles.marginTop(16), GStyles.marginBottom(50)]}>
        A {DIGIT_CODE.length}-digit code was sent to <Text style={FontStyles.font4}>{loginGuardianType}</Text>. Enter it
        within {DIGIT_CODE.expiration} minutes
      </TextM>
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
