import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import { useUser } from 'hooks/store';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import { checkPin } from 'utils/redux';
import { useNavigation } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import useBiometricsReady from 'hooks/useBiometrics';
import { usePreventHardwareBack } from '@portkey-wallet/hooks/mobile';
import { onResultFail, TimerResult } from 'utils/wallet';
import { setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { VerificationType } from '@portkey-wallet/types/verifier';
import useEffectOnce from 'hooks/useEffectOnce';
import PinContainer from 'components/PinContainer';
import { useIntervalGetResult } from 'hooks/login';
import { getSecureStoreItem } from '@portkey-wallet/utils/mobile/biometric';
import useDebounceCallback from 'hooks/useDebounceCallback';
let appState: AppStateStatus, verifyTime: number;
export default function SecurityLock() {
  const { biometrics } = useUser();
  const biometricsReady = useBiometricsReady();
  const [caInfo, setStateCAInfo] = useState<CAInfo>();
  usePreventHardwareBack();
  const timer = useRef<TimerResult>();

  const digitInput = useRef<DigitInputInterface>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { managerInfo, address, caHash } = useCurrentWalletInfo();
  const dispatch = useAppDispatch();
  const isSyncCAInfo = useMemo(() => address && managerInfo && !caHash, [address, caHash, managerInfo]);
  const navigation = useNavigation();
  const onIntervalGetResult = useIntervalGetResult();

  useEffect(() => {
    if (isSyncCAInfo) {
      setTimeout(() => {
        if (managerInfo) {
          timer.current?.remove();
          timer.current = onIntervalGetResult({
            managerInfo: managerInfo,
            onPass: setStateCAInfo,
            onFail: message =>
              onResultFail(
                dispatch,
                message,
                managerInfo?.verificationType === VerificationType.communityRecovery,
                true,
              ),
          });
        }
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
      if (!managerInfo) return;
      if (isSyncCAInfo && !caInfo) {
        timer.current?.remove();
        Loading.show();
        timer.current = onIntervalGetResult({
          managerInfo: managerInfo,
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
            onResultFail(dispatch, message, managerInfo?.verificationType === VerificationType.communityRecovery, true),
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
    [caInfo, dispatch, handleRouter, isSyncCAInfo, managerInfo, onIntervalGetResult],
  );
  const verifyBiometrics = useDebounceCallback(
    async () => {
      if (!biometrics || (verifyTime && verifyTime + 1000 > new Date().getTime())) return;
      try {
        const securePassword = await getSecureStoreItem('Pin');
        if (!securePassword) return;
        handlePassword(securePassword);
      } catch (error) {
        console.log(error, '=====error');
      }
      verifyTime = new Date().getTime();
    },
    [biometrics, handlePassword],
    1000,
  );
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
          digitInput.current?.reset();
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
      <PinContainer ref={digitInput} title="Enter Pin" onChangeText={onChangeText} errorMessage={errorMessage} />
    </PageContainer>
  );
}
