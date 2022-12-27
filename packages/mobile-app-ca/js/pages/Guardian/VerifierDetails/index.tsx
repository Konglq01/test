import { DIGIT_CODE } from '@portkey/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import VerifierCountdown, { VerifierCountdownInterface } from 'components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { VerifierItem } from '@portkey/types/verifier';
import GuardianAccountItem from '../GuardianAccountItem';
import { FontStyles } from 'assets/theme/styles';
import { WalletInfoType } from '@portkey/types/wallet';
import { request } from 'api';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';

export default function VerifierDetails() {
  const { email, item, walletInfo, verifierSessionId } = useRouterParams<{
    email?: string;
    item?: VerifierItem;
    walletInfo?: WalletInfoType;
    verifierSessionId?: string;
  }>();
  console.log(walletInfo, verifierSessionId, '====walletInfo');

  const countdown = useRef<VerifierCountdownInterface>();
  const digitInput = useRef<DigitInputInterface>();
  const onFinish = useCallback(
    async (code: string) => {
      try {
        Loading.show();
        const req = await request.verify.verifyCode({
          baseURL: 'http://192.168.66.135:5588/',
          data: {
            type: 0,
            code,
            loginGuardianType: email,
            verifierSessionId,
          },
        });
        if (req.verifierSessionId) {
          navigationService.navigate('SetPin', {
            registerInfo: { walletInfo, loginGuardianType: email, type: 0 },
          });
        } else {
          throw new Error('verify fail');
        }
        console.log(req, '=====req-verifyCode');
      } catch (error) {
        digitInput.current?.resetPin();
        console.log(error, '====error');
      }
      Loading.hide();
    },
    [email, verifierSessionId, walletInfo],
  );
  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      <GuardianAccountItem
        item={{
          name: 'portkey',
          imageUrl: 'PortKey',
          url: 'string',
          id: 'string',
        }}
        isButtonHide
      />
      <TextM style={[FontStyles.font3, GStyles.marginTop(16), GStyles.marginBottom(50)]}>
        A {DIGIT_CODE.length}-digit code was sent to <Text style={FontStyles.font4}>{email}</Text>. Enter it within{' '}
        {DIGIT_CODE.expiration} minutes.
      </TextM>
      <DigitInput ref={digitInput} onFinish={onFinish} maxLength={DIGIT_CODE.length} />
      <VerifierCountdown
        style={GStyles.marginTop(24)}
        onResend={() => {
          countdown.current?.resetTime(60);
        }}
        ref={countdown}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: 8,
  },
});
