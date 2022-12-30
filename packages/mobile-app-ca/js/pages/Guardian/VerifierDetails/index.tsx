import { DIGIT_CODE } from '@portkey/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import VerifierCountdown, { VerifierCountdownInterface } from 'components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { VerifierItem } from '@portkey/types/verifier';
import GuardianAccountItem from '../GuardianAccountItem';
import { FontStyles } from 'assets/theme/styles';
import { request } from 'api';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
export default function VerifierDetails() {
  const { loginGuardianType, item, verifierSessionId, managerUniqueId, onVerifierSuccess } = useRouterParams<{
    loginGuardianType?: string;
    item?: VerifierItem;
    verifierSessionId?: string;
    managerUniqueId?: string;
    onVerifierSuccess?: () => void;
  }>();
  const [stateSessionId, setStateSessionId] = useState<string>(verifierSessionId || '');
  console.log(stateSessionId, '=====stateSessionId');

  const countdown = useRef<VerifierCountdownInterface>();
  const digitInput = useRef<DigitInputInterface>();
  const onFinish = useCallback(
    async (code: string) => {
      if (!stateSessionId || !loginGuardianType || !code) return;
      console.log(stateSessionId, '=====stateSessionId');

      try {
        Loading.show();
        let fetch = request.register;
        if (onVerifierSuccess) fetch = request.recovery;
        await fetch.verifyCode({
          baseURL: 'http://192.168.66.135:5588/',
          data: {
            type: 0,
            code,
            loginGuardianType,
            verifierSessionId: stateSessionId,
          },
        });
        if (onVerifierSuccess) {
          onVerifierSuccess();
          navigationService.goBack();
        } else {
          navigationService.navigate('SetPin', {
            registerInfo: { loginGuardianType, type: 0, managerUniqueId },
          });
        }
      } catch (error) {
        CommonToast.failError(error, 'Verify Fail');
        digitInput.current?.resetPin();
      }
      Loading.hide();
    },
    [loginGuardianType, managerUniqueId, onVerifierSuccess, stateSessionId],
  );
  const resendCode = useCallback(async () => {
    Loading.show();
    try {
      const req = await request.register.sendCode({
        baseURL: 'http://192.168.66.135:5588/',
        data: {
          type: 0,
          loginGuardianType,
          managerUniqueId,
        },
      });
      if (req.verifierSessionId) {
        setStateSessionId(req.verifierSessionId);
        countdown.current?.resetTime(60);
        digitInput.current?.resetPin();
      }
    } catch (error) {
      CommonToast.failError(error, 'Verify Fail');
    }
    Loading.hide();
  }, [loginGuardianType, managerUniqueId]);
  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      <GuardianAccountItem
        item={{
          name: 'portkey',
          imageUrl: 'PortKey',
          url: 'string',
        }}
        isButtonHide
      />
      <TextM style={[FontStyles.font3, GStyles.marginTop(16), GStyles.marginBottom(50)]}>
        A {DIGIT_CODE.length}-digit code was sent to <Text style={FontStyles.font4}>{email}</Text>. Enter it within{' '}
        {DIGIT_CODE.expiration} minutes.
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
