import { PIN_SIZE } from '@portkey/constants/misc';
import { TextL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import useRouterParams from '@portkey/hooks/useRouterParams';
import React, { useCallback, useRef, useState } from 'react';
import navigationService from 'utils/navigationService';
import { StyleSheet, View } from 'react-native';
import { windowHeight } from '@portkey/utils/mobile/device';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { useAppDispatch } from 'store/hooks';
import { changePin } from '@portkey/store/store-ca/wallet/actions';
import CommonToast from 'components/CommonToast';
import { setCredentials } from 'store/user/actions';
import { useUser } from 'hooks/store';
import { setSecureStoreItem } from '@portkey/utils/mobile/biometric';
import { ManagerInfo } from '@portkey/types/types-ca/wallet';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { useOnManagerAddressAndQueryResult } from 'hooks/login';
import myEvents from 'utils/deviceEvent';

export default function ConfirmPin() {
  const { walletInfo } = useCurrentWallet();
  const { pin, oldPin, managerInfo, guardianCount } = useRouterParams<{
    oldPin?: string;
    pin?: string;
    managerInfo?: ManagerInfo;
    guardianCount?: number;
  }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();
  const dispatch = useAppDispatch();
  const { biometrics } = useUser();
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult();
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
  const onFinish = useCallback(
    async (confirmPin: string) => {
      onManagerAddressAndQueryResult({
        managerInfo: managerInfo as ManagerInfo,
        confirmPin,
        walletInfo,
        guardianCount,
      });
    },
    [guardianCount, managerInfo, onManagerAddressAndQueryResult, walletInfo],
  );

  const onChangeText = useCallback(
    async (confirmPin: string) => {
      if (confirmPin.length !== PIN_SIZE) {
        if (errorMessage) setErrorMessage(undefined);
        return;
      }

      if (confirmPin !== pin) {
        pinRef.current?.resetPin();
        return setErrorMessage('Pins do not match');
      }

      if (oldPin) return onChangePin(confirmPin);
      if (managerInfo) return onFinish(confirmPin);
    },
    [errorMessage, oldPin, onChangePin, onFinish, pin, managerInfo],
  );
  return (
    <PageContainer
      titleDom
      type="leftBack"
      leftCallback={() => {
        myEvents.clearSetPin.emit('clearSetPin');
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
