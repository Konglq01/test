import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { screenHeight, windowHeight } from '@portkey/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import DigitInput, { DigitInputProps } from 'components/DigitInput';
import { pTd } from 'utils/unit';
function getMarginTop() {
  if (screenHeight > 800) return 0.35;
  if (screenHeight > 700) return 0.3;
  return 0.25;
}

type PinContainerProps = {
  title: string;
} & DigitInputProps;

const PinContainer = forwardRef(({ title, style, ...inputProps }: PinContainerProps, forwardedRef) => {
  return (
    <View style={styles.container}>
      <TextL style={GStyles.textAlignCenter}>{title}</TextL>
      <DigitInput ref={forwardedRef} type="pin" secureTextEntry style={[styles.pinStyle, style]} {...inputProps} />
    </View>
  );
});

PinContainer.displayName = 'PinContainer';

export default PinContainer;

const styles = StyleSheet.create({
  container: {
    marginTop: windowHeight * getMarginTop(),
  },
  pinStyle: {
    marginTop: 24,
    width: pTd(230),
    alignSelf: 'center',
  },
});
