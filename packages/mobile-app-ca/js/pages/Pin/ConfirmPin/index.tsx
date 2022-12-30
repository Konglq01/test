import { PIN_SIZE } from '@portkey/constants/misc';
import { TextL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import useBiometricsReady from 'hooks/useBiometrics';
import useRouterParams from '@portkey/hooks/useRouterParams';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import navigationService from 'utils/navigationService';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { windowHeight } from '@portkey/utils/mobile/device';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { useAppDispatch } from 'store/hooks';
import { changePin, createWallet } from '@portkey/store/store-ca/wallet/actions';
import CommonToast from 'components/CommonToast';
import { setCredentials } from 'store/user/actions';
import { useUser } from 'hooks/store';
import { setSecureStoreItem } from '@portkey/utils/mobile/biometric';
import { RegisterInfo } from '../types';
import Loading from 'components/Loading';
import { request } from 'api';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import AElf from 'aelf-sdk';
import { sleep } from '@portkey/utils';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { intervalGetRegisterResult, TimerResult } from 'utils/wallet';
export default function ConfirmPin() {
  const biometricsReady = useBiometricsReady();
  const { apiUrl } = useCurrentNetworkInfo();
  const { pin, oldPin, registerInfo } = useRouterParams<{
    oldPin?: string;
    pin?: string;
    registerInfo?: RegisterInfo;
  }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();
  const dispatch = useAppDispatch();
  const { biometrics } = useUser();
  const timer = useRef<TimerResult>();
  const onChangePin = useCallback(
    async (newPin: string) => {
      if (!oldPin) return;
      try {
        if (biometrics) await setSecureStoreItem('Pin', newPin);
        dispatch(changePin({ pin: oldPin, newPin }));
        dispatch(setCredentials({ pin: newPin }));
        CommonToast.success('Modified Success');
      } catch (error) {
        CommonToast.failError(error);
      }
      navigationService.navigate('AccountSettings');
    },
    [biometrics, dispatch, oldPin],
  );
  const onRegister = useCallback(
    async (confirmPin: string) => {
      if (!registerInfo) return;
      Loading.show();
      await sleep(1000);
      try {
        const walletInfo = AElf.wallet.createNewWallet();
        await request.register.managerAddress({
          baseURL: apiUrl,
          data: {
            ...registerInfo,
            chainId: DefaultChainId,
            managerAddress: walletInfo.address,
            deviceString: JSON.stringify(new Date().getTime()),
          },
        });
        dispatch(createWallet({ walletInfo, managerInfo: registerInfo, pin: confirmPin }));
        if (biometricsReady) {
          Loading.hide();
          navigationService.navigate('SetBiometrics', { pin: confirmPin });
        } else {
          timer.current = intervalGetRegisterResult({
            dispatch,
            apiUrl,
            pin: confirmPin,
            managerInfo: registerInfo,
          });
        }
      } catch (error) {
        Loading.hide();
        CommonToast.failError(error);
      }
    },
    [apiUrl, biometricsReady, dispatch, registerInfo],
  );

  const onChangeText = useCallback(
    async (confirmPin: string) => {
      if (confirmPin.length !== PIN_SIZE) {
        if (errorMessage) setErrorMessage(undefined);
        return;
      }

      if (confirmPin !== pin) {
        pinRef.current?.resetPin();
        return setErrorMessage('Pin do not match');
      }

      if (oldPin) return onChangePin(confirmPin);
      if (registerInfo) return onRegister(confirmPin);
    },
    [errorMessage, oldPin, onChangePin, onRegister, pin, registerInfo],
  );
  useEffect(() => {
    return () => {
      timer.current?.remove();
    };
  }, []);
  return (
    <PageContainer
      titleDom
      type="leftBack"
      leftCallback={() => {
        DeviceEventEmitter.emit('clearSetPin');
        navigationService.goBack();
      }}>
      <View style={styles.container}>
        <TextL style={GStyles.textAlignCenter}>Confirm Pin</TextL>
        <DigitInput
          type="pin"
          ref={pinRef}
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
    marginTop: windowHeight * 0.3,
  },
  pinStyle: {
    marginTop: 24,
  },
});
