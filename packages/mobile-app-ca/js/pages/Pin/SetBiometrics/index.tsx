import React, { useCallback, useState } from 'react';
import { TextL, TextS } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import { setSecureStoreItem } from '@portkey/utils/mobile/biometric';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { Image, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { BGStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import { useAppDispatch } from 'store/hooks';
import { setBiometrics } from 'store/user/actions';
import { usePreventHardwareBack } from '@portkey/hooks/mobile';
import biometric from 'assets/image/pngs/biometric.png';
import { pTd } from 'utils/unit';
const ScrollViewProps = { disabled: true };
export default function SetBiometrics() {
  const dispatch = useAppDispatch();
  const { pin } = useRouterParams<{ pin?: string }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  usePreventHardwareBack();
  const openBiometrics = useCallback(async () => {
    if (!pin) return;
    try {
      await setSecureStoreItem('Pin', pin);
      dispatch(setBiometrics(true));
    } catch (error: any) {
      setErrorMessage(typeof error.message === 'string' ? error.message : 'Verification failed');
    }
  }, [dispatch, pin]);
  return (
    <PageContainer scrollViewProps={ScrollViewProps} leftDom titleDom containerStyles={styles.containerStyles}>
      <Touchable style={GStyles.itemCenter} onPress={openBiometrics}>
        <Image resizeMode="contain" source={biometric} style={styles.biometricIcon} />
        <TextL style={styles.tipText}>Biometric for quick access</TextL>
        {errorMessage ? <TextS style={styles.errorText}>{errorMessage}</TextS> : null}
      </Touchable>
      <CommonButton
        type="clear"
        title="Skip"
        buttonStyle={BGStyles.transparent}
        onPress={() => navigationService.navigate('Tab')}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    justifyContent: 'space-between',
    paddingBottom: 52,
    paddingTop: '25%',
    alignItems: 'center',
  },
  tipText: {
    marginTop: -38,
  },
  errorText: {
    marginTop: 16,
    color: defaultColors.error,
  },
  biometricIcon: {
    width: pTd(124),
  },
});
