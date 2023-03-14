import React, { forwardRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import DigitInput, { DigitInputProps } from 'components/DigitInput';
import { pTd } from 'utils/unit';
import { headerHeight } from 'components/CustomHeader/style/index.style';
import Keypad, { KeypadPropsType } from 'components/Keypad';

type PinContainerProps = {
  title: string;
  showHeader?: boolean;
} & DigitInputProps &
  KeypadPropsType;

const PinContainer = forwardRef(
  (
    {
      title,
      style,
      showHeader,
      onChangeText,
      onFinish,
      maxLength,
      isBiometrics,
      onBiometricsPress,
      ...inputProps
    }: PinContainerProps,
    forwardedRef,
  ) => {
    const [value, setValue] = useState('');

    return (
      <View style={[styles.container, showHeader && { paddingTop: styles.container.paddingTop - headerHeight }]}>
        <View>
          <TextL style={GStyles.textAlignCenter}>{title}</TextL>
          <DigitInput
            disabled={true}
            type="pin"
            secureTextEntry
            style={[styles.pinStyle, style]}
            maxLength={maxLength}
            value={value}
            {...inputProps}
          />
        </View>

        <Keypad
          ref={forwardedRef}
          maxLength={maxLength}
          onChange={_value => {
            setValue(_value);
            onChangeText && onChangeText(_value);
          }}
          onFinish={onFinish}
          onRest={() => {
            setValue('');
          }}
          onBiometricsPress={onBiometricsPress}
          isBiometrics={isBiometrics}
        />
      </View>
    );
  },
);

PinContainer.displayName = 'PinContainer';

export default PinContainer;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingTop: windowHeight * 0.25,
    justifyContent: 'space-between',
    paddingBottom: pTd(40),
  },
  pinStyle: {
    marginTop: 24,
    width: pTd(230),
    alignSelf: 'center',
  },
});
