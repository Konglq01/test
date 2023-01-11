import React, { useCallback, useRef, useState } from 'react';
import { TextL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import navigationService from 'utils/navigationService';
import { PIN_SIZE } from '@portkey/constants/misc';
import { StyleSheet, View } from 'react-native';
import { windowHeight } from '@portkey/utils/mobile/device';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { checkPin } from 'utils/redux';
import { PinErrorMessage } from '@portkey/utils/wallet/types';
import myEvents from 'utils/deviceEvent';
import { useFocusEffect } from '@react-navigation/native';

export default function CheckPin() {
  const { openBiometrics } = useRouterParams<{ openBiometrics?: boolean }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();
  useFocusEffect(
    useCallback(() => {
      pinRef.current?.reset();
    }, []),
  );
  const onChangeText = useCallback(
    (pin: string) => {
      if (pin.length === PIN_SIZE) {
        if (!checkPin(pin)) {
          pinRef.current?.reset();
          return setErrorMessage(PinErrorMessage.invalidPin);
        }
        if (openBiometrics) {
          myEvents.openBiometrics.emit(pin);
          navigationService.goBack();
        } else {
          navigationService.navigate('SetPin', { oldPin: pin });
        }
      } else if (errorMessage) {
        setErrorMessage(undefined);
      }
    },
    [errorMessage, openBiometrics],
  );
  return (
    <PageContainer titleDom type="leftBack" backTitle={!openBiometrics ? 'Change Pin' : 'Authentication'}>
      <View style={styles.container}>
        <TextL style={GStyles.textAlignCenter}>Enter Pin</TextL>
        <DigitInput
          ref={pinRef}
          type="pin"
          secureTextEntry
          style={styles.pinStyle}
          errorMessage={errorMessage}
          onChangeText={onChangeText}
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
