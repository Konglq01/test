import React, { useRef, useState, memo, useCallback } from 'react';
import { StyleSheet, View, TextInput, TouchableHighlight, StyleProp, ViewStyle } from 'react-native';
import { screenWidth } from '@portkey/utils/mobile/device';

type Props = {
  maxLength: number;
  style?: StyleProp<ViewStyle>;
  inputItemStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  onChange?: (v: string) => void;
};
const PasswordInput = (props: Props) => {
  const input = useRef<any>();
  const [text, setText] = useState('');
  const onPress = useCallback(() => {
    input.current && input.current.focus();
  }, [input]);
  const getInputItem = () => {
    const { maxLength, inputItemStyle, iconStyle } = props;
    const inputItem = [];
    for (let i = 0; i < maxLength; i++) {
      if (i === 0) {
        inputItem.push(
          <View key={i} style={[styles.inputItem, inputItemStyle]}>
            {i < text.length ? <View style={[styles.iconStyle, iconStyle]} /> : null}
          </View>,
        );
      } else {
        inputItem.push(
          <View key={i} style={[styles.inputItem, styles.inputItemBorderLeftWidth, inputItemStyle]}>
            {i < text.length ? <View style={[styles.iconStyle, iconStyle]} /> : null}
          </View>,
        );
      }
    }
    return inputItem;
  };
  const { onChange, maxLength, style } = props;
  return (
    <TouchableHighlight onPress={onPress} activeOpacity={1} underlayColor="transparent">
      <View style={[styles.container, style]}>
        <TextInput
          style={styles.inputStyle}
          ref={input}
          maxLength={maxLength}
          autoFocus={true}
          keyboardType="numeric"
          onChangeText={value => {
            setText(value);
            onChange && onChange(value);
          }}
        />
        {getInputItem()}
      </View>
    </TouchableHighlight>
  );
};
export default memo(PasswordInput);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  inputItem: {
    height: screenWidth / 8,
    width: screenWidth / 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputItemBorderLeftWidth: {
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  iconStyle: {
    width: 16,
    height: 16,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  inputStyle: {
    height: 45,
    zIndex: 99,
    position: 'absolute',
    width: (screenWidth / 8) * 6,
    opacity: 0,
  },
});
