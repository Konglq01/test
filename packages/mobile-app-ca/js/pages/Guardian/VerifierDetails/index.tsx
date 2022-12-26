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
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';

export default function VerifierDetails() {
  const { email, item } = useRouterParams<{ email?: string; item?: VerifierItem }>();
  const countdown = useRef<VerifierCountdownInterface>();
  const digitInput = useRef<DigitInputInterface>();
  const onFinish = useCallback((code: string) => {
    // TODO: fetch
    if (code !== '111111') {
      CommonToast.fail('code invalid');
      digitInput.current?.resetPin();
    } else {
      navigationService.navigate('SetPin');
    }
  }, []);
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
