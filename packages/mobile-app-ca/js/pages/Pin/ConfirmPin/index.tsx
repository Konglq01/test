import { PIN_SIZE } from '@portkey/constants/misc';
import { TextL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import useBiometricsReady from 'hooks/useBiometrics';
import useRouterParams from '@portkey/hooks/useRouterParams';
import React, { useCallback, useRef, useState } from 'react';
import navigationService from 'utils/navigationService';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { windowHeight } from '@portkey/utils/mobile/device';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { useAppDispatch } from 'store/hooks';
import { changePin } from '@portkey/store/store-ca/wallet/actions';
import CommonToast from 'components/CommonToast';
import { setCredentials } from 'store/user/actions';
import { useUser } from 'hooks/store';
import i18n from 'i18n';
import { setSecureStoreItem } from '@portkey/utils/mobile/biometric';
import { RegisterInfo } from '../types';
import Loading from 'components/Loading';
import { request } from 'api';

export default function ConfirmPin() {
  const biometricsReady = useBiometricsReady();
  const { pin, oldPin, registerInfo } = useRouterParams<{
    oldPin?: string;
    pin?: string;
    registerInfo?: RegisterInfo;
  }>();
  console.log(registerInfo, '=====registerInfo');

  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();
  const dispatch = useAppDispatch();
  const { biometrics } = useUser();
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

      if (oldPin) {
        try {
          if (biometrics) await setSecureStoreItem('Pin', pin);
          dispatch(changePin({ pin: oldPin, newPin: confirmPin }));
          dispatch(setCredentials({ pin }));
          CommonToast.success('Modified Success');
        } catch (error: any) {
          CommonToast.fail(typeof error.message === 'string' ? error.message : i18n.t('Change Failed'));
        }
        navigationService.navigate('AccountSettings');
      } else if (registerInfo) {
        request.register.managerAddress({
          baseURL: 'http://192.168.66.135:5577/',
          data: {},
        });
        // TODO:biometricsReady
        if (biometricsReady) {
          navigationService.navigate('SetBiometrics', { pin });
        } else {
          Loading.show();
        }
      }
    },
    [biometrics, biometricsReady, dispatch, errorMessage, oldPin, pin],
  );
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
