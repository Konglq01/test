import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, BackHandler, StyleSheet, View } from 'react-native';
import { TextL } from 'components/CommonText';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import { useCredentials, useUser } from 'hooks/store';
import secureStore from '@portkey/utils/mobile/secureStore';
import GStyles from 'assets/theme/GStyles';
import { windowHeight } from '@portkey/utils/mobile/device';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import { PIN_SIZE } from '@portkey/constants/misc';
import { checkPin } from 'utils/redux';
import { useNavigation } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import usePrevious from 'hooks/usePrevious';
import { setCAInfo } from '@portkey/store/store-ca/wallet/actions';
import useBiometricsReady from 'hooks/useBiometrics';
import { usePreventHardwareBack } from '@portkey/hooks/mobile';
let appState: AppStateStatus;
export default function SecurityLock() {
  const { pin } = useCredentials() || {};
  const { biometrics } = useUser();
  const biometricsReady = useBiometricsReady();
  usePreventHardwareBack();
  const digitInput = useRef<DigitInputInterface>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { walletInfo } = useCurrentWallet();
  const dispatch = useAppDispatch();
  const isSyncCAInfo = useMemo(
    () => walletInfo.address && !walletInfo.AELF?.caAddress,
    [walletInfo.AELF?.caAddress, walletInfo.address],
  );
  const prevIsSyncCAInfo = usePrevious(isSyncCAInfo);
  const navigation = useNavigation();
  useEffect(() => {
    if (isSyncCAInfo) {
      console.log('fetch step 14');
    }
  }, [isSyncCAInfo]);

  const handleRouter = useCallback(
    (pinInput: string) => {
      Loading.hide();
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        if (biometrics === undefined && biometricsReady) {
          navigationService.reset('SetBiometrics', { pin: pinInput });
        } else {
          navigationService.reset('Tab');
        }
      }
    },
    [biometrics, biometricsReady, navigation],
  );

  useEffect(() => {
    if (!isSyncCAInfo && isSyncCAInfo !== prevIsSyncCAInfo && pin && checkPin(pin)) {
      handleRouter(pin);
    }
  }, [handleRouter, isSyncCAInfo, pin, prevIsSyncCAInfo]);
  const handlePassword = useCallback(
    (pwd: string) => {
      dispatch(setCredentials({ pin: pwd }));
      if (isSyncCAInfo) {
        Loading.show('loading...');
        setTimeout(() => {
          dispatch(setCAInfo({ caInfo: { caAddress: 'aaaa', caHash: 'xxx' }, pin: '123456', chainId: 'AELF' }));
        }, 5000);
        return;
      }
      handleRouter(pwd);
    },
    [dispatch, handleRouter, isSyncCAInfo],
  );
  const verifyBiometrics = useCallback(async () => {
    if (!biometrics) return;
    try {
      const securePassword = await secureStore.getItemAsync('Pin');
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
    return () => {
      listener.remove();
      appState = 'background';
    };
  }, [handleAppStateChange]);
  const onChangeText = useCallback(
    (enterPin: string) => {
      if (enterPin.length === PIN_SIZE) {
        if (!checkPin(enterPin)) {
          digitInput.current?.resetPin();
          setErrorMessage('Incorrect Pin');
          return;
        }
        handlePassword(enterPin);
      } else if (errorMessage) {
        setErrorMessage(undefined);
      }
    },
    [errorMessage, handlePassword],
  );
  return (
    <PageContainer hideHeader>
      <View style={styles.container}>
        <TextL style={GStyles.textAlignCenter}>Enter Pin</TextL>
        <DigitInput
          ref={digitInput}
          type="pin"
          secureTextEntry
          style={styles.pinStyle}
          onChangeText={onChangeText}
          errorMessage={errorMessage}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: pTd(230),
    alignSelf: 'center',
    marginTop: windowHeight * 0.35,
  },
  pinStyle: {
    marginTop: 24,
  },
});
