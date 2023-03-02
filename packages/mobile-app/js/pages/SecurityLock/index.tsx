import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, BackHandler, StyleSheet, View } from 'react-native';
import navigationService from 'utils/navigationService';
import { PrimaryText, TextXXXL } from 'components/CommonText';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import Touchable from 'components/Touchable';
import { useUser, useWallet } from 'hooks/store';
import secureStore from 'utils/secureStore';
import useLogOut from 'hooks/useLogOut';
import GStyles from 'assets/theme/GStyles';
import { sleep } from '@portkey-wallet/utils';
import VerifyPasswordInput, { VerifyPasswordInputInterface } from 'components/VerifyPasswordInput';
import CommonButton from 'components/CommonButton';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import { screenWidth, windowHeight } from 'utils/device';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import { useNavigation } from '@react-navigation/native';
import useKeyboardHeight from 'hooks/useKeyboardHeight';
import { useLanguage } from 'i18n/hooks';

let appState: AppStateStatus;
export default function SecurityLock() {
  const keyboardHeight = useKeyboardHeight();
  const passwordRef = useRef<VerifyPasswordInputInterface>();
  const [loading, setLoading] = useState<boolean>();
  const { walletInfo } = useWallet();
  const { biometrics } = useUser();
  const navigation = useNavigation();
  const onLogOut = useLogOut();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const handlePassword = useCallback(
    (pwd: string) => {
      dispatch(setCredentials({ password: pwd }));
      if (walletInfo && !walletInfo.isBackup) {
        navigationService.reset('CreateSuccess');
      } else {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigationService.reset('Tab');
        }
      }
    },
    [dispatch, navigation, walletInfo],
  );
  const verifyPassword = useCallback(async () => {
    if (!passwordRef.current) return;
    setLoading(true);
    await sleep(10);
    const [success, password] = await passwordRef.current.verifyPassword();
    if (success) handlePassword(password);
    setLoading(false);
  }, [handlePassword]);
  const verifyBiometrics = useCallback(async () => {
    if (!biometrics) return;
    try {
      const securePassword = await secureStore.getItemAsync('Password');
      if (!securePassword) return;
      handlePassword(securePassword);
    } catch (error) {
      console.log(error, '=====error');
    }
  }, [biometrics, handlePassword]);
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && appState !== 'active') {
        verifyBiometrics();
        appState = nextAppState;
      }
    },
    [verifyBiometrics],
  );
  useEffect(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => {
      backHandler.remove();
      listener.remove();
      appState = 'background';
    };
  }, [handleAppStateChange]);
  return (
    <PageContainer hideHeader>
      <View
        style={[
          styles.viewContainer,
          { minHeight: windowHeight - (keyboardHeight ? pTd(40) : pTd(70)) - keyboardHeight },
        ]}>
        <Svg
          iconStyle={GStyles.alignCenter}
          color={defaultColors.primaryColor}
          size={screenWidth * 0.2}
          icon="logo-icon"
        />
        <TextXXXL style={[GStyles.alignCenter, styles.titleText]}>{t('Welcome Back!')}</TextXXXL>
        <VerifyPasswordInput label={t('Password')} ref={passwordRef} />
        <CommonButton
          title={t('Unlock')}
          type="primary"
          loading={loading}
          onPress={verifyPassword}
          containerStyle={styles.button}
        />
      </View>
      <Touchable style={[GStyles.alignCenter, GStyles.flexRow, GStyles.itemCenter]} onPress={onLogOut}>
        <Svg size={pTd(16)} icon="reload" />
        <PrimaryText style={styles.resetText}>{t('Reset Wallet')}</PrimaryText>
      </Touchable>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
  titleText: {
    marginTop: 32,
    marginBottom: 50,
  },
  button: {
    marginTop: 20,
  },
  resetText: {
    marginTop: 10,
    // marginVertical: 20,
    marginLeft: pTd(8),
  },
  viewContainer: {
    paddingTop: windowHeight * 0.08,
  },
});
