import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, StyleSheet, View } from 'react-native';
import { TextL } from 'components/CommonText';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import { useUser } from 'hooks/store';
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
import useBiometricsReady from 'hooks/useBiometrics';
import { usePreventHardwareBack } from '@portkey/hooks/mobile';
import { intervalGetResult, onResultFail, TimerResult } from 'utils/wallet';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { setCAInfo } from '@portkey/store/store-ca/wallet/actions';
import { CAInfo } from '@portkey/types/types-ca/wallet';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { VerificationType } from '@portkey/types/verifier';
import useEffectOnce from 'hooks/useEffectOnce';
let appState: AppStateStatus;
export default function SecurityLock() {
  const { biometrics } = useUser();
  const { apiUrl } = useCurrentNetworkInfo();
  const biometricsReady = useBiometricsReady();
  const [caInfo, setStateCAInfo] = useState<CAInfo>();
  usePreventHardwareBack();
  const timer = useRef<TimerResult>();

  const digitInput = useRef<DigitInputInterface>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { walletInfo } = useCurrentWallet();
  const dispatch = useAppDispatch();
  const isSyncCAInfo = useMemo(
    () => walletInfo.address && walletInfo.managerInfo && !walletInfo.AELF?.caAddress,
    [walletInfo.AELF?.caAddress, walletInfo.address, walletInfo.managerInfo],
  );
  const navigation = useNavigation();
  useEffect(() => {
    if (isSyncCAInfo) {
      setTimeout(() => {
        if (walletInfo.managerInfo && apiUrl)
          timer.current = intervalGetResult({
            apiUrl,
            managerInfo: walletInfo.managerInfo,
            onPass: setStateCAInfo,
            onFail: message =>
              onResultFail(
                dispatch,
                message,
                walletInfo.managerInfo?.verificationType === VerificationType.communityRecovery,
                true,
              ),
          });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handlePassword = useCallback(
    (pwd: string) => {
      dispatch(setCredentials({ pin: pwd }));
      if (!walletInfo.managerInfo) return;
      if (isSyncCAInfo && !caInfo) {
        timer.current?.remove();
        Loading.show();
        timer.current = intervalGetResult({
          apiUrl,
          managerInfo: walletInfo.managerInfo,
          onPass: (info: CAInfo) => {
            dispatch(
              setCAInfo({
                caInfo: info,
                pin: pwd,
                chainId: DefaultChainId,
              }),
            );
            Loading.hide();
            handleRouter(pwd);
          },
          onFail: message =>
            onResultFail(
              dispatch,
              message,
              walletInfo.managerInfo?.verificationType === VerificationType.communityRecovery,
              true,
            ),
        });
        return;
      } else if (caInfo) {
        dispatch(
          setCAInfo({
            caInfo,
            pin: pwd,
            chainId: DefaultChainId,
          }),
        );
      }
      handleRouter(pwd);
    },
    [apiUrl, caInfo, dispatch, handleRouter, isSyncCAInfo, walletInfo.managerInfo],
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
  useEffectOnce(() => {
    if (!navigation.canGoBack()) verifyBiometrics();
  });
  useEffect(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      timer.current?.remove();
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
