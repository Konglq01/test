import { PIN_SIZE } from '@portkey/constants/misc';
import { InputProps, Text } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import { TextS } from 'components/CommonText';
import React, { useRef, useState, useCallback, memo, useMemo, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, TextInput, TouchableHighlight, StyleProp, ViewStyle } from 'react-native';
import { screenWidth } from '@portkey/utils/mobile/device';
import { isValidPositiveInteger } from '@portkey/utils/reg';

type DigitInputProps = {
  maxLength?: number;
  inputItemStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  type?: 'pin' | 'default';
  onFinish?: (code: string) => void;
} & InputProps;

export type DigitInputInterface = {
  resetPin: () => void;
};

function InputItem({
  secureTextEntry,
  text,
  iconStyle,
}: {
  secureTextEntry?: boolean;
  text?: string;
  iconStyle?: StyleProp<ViewStyle>;
}) {
  if (secureTextEntry) return <View style={[styles.iconStyle, iconStyle]} />;
  return <Text style={styles.textStyles}>{text}</Text>;
}

const DigitInput = forwardRef(
  (
    {
      secureTextEntry,
      maxLength = PIN_SIZE,
      inputItemStyle,
      iconStyle,
      onChangeText,
      style,
      keyboardType = 'numeric',
      errorMessage,
      type = 'default',
      onFinish,
    }: DigitInputProps,
    forwardedRef,
  ) => {
    const input = useRef<any>();
    const [text, setText] = useState('');
    const styleProps = useMemo(() => {
      return {
        inputItem: {
          width: screenWidth / (maxLength + 4),
          height: screenWidth / (maxLength + 2),
        },
        inputStyle: {
          width: (screenWidth / (maxLength + 2)) * maxLength,
        },
      };
    }, [maxLength]);
    const getInputItem = useCallback(() => {
      const inputItem = [];
      for (let i = 0; i < maxLength; i++) {
        if (type === 'pin') {
          inputItem.push(<View key={i} style={i < text.length ? styles.pinSecureText : styles.pinPlaceholder} />);
        } else {
          inputItem.push(
            <View key={i} style={[styles.inputItem, styleProps.inputItem, inputItemStyle]}>
              {i < text.length ? (
                <InputItem secureTextEntry={secureTextEntry} iconStyle={iconStyle} text={text[i]} />
              ) : null}
            </View>,
          );
        }
      }
      return inputItem;
    }, [iconStyle, inputItemStyle, maxLength, secureTextEntry, styleProps.inputItem, text, type]);
    const resetPin = useCallback(() => setText(''), []);
    useImperativeHandle(forwardedRef, () => ({ resetPin }), [resetPin]);

    return (
      <TouchableHighlight onPress={() => input.current?.focus()} activeOpacity={1} underlayColor="transparent">
        <View>
          <View style={[styles.container, type === 'pin' ? styles.pinContainer : undefined, style]}>
            <TextInput
              contextMenuHidden={type === 'pin'}
              style={[styles.inputStyle, styleProps.inputStyle]}
              ref={input}
              value={text}
              maxLength={maxLength}
              // autoFocus={true}
              keyboardType={keyboardType}
              onChangeText={value => {
                if (value && !isValidPositiveInteger(value)) return;
                setText(value);
                onChangeText?.(value);
                if (value.length === maxLength) onFinish?.(value);
              }}
            />
            {getInputItem()}
          </View>
          {errorMessage ? <TextS style={styles.errorText}>{errorMessage}</TextS> : null}
        </View>
      </TouchableHighlight>
    );
  },
);
DigitInput.displayName = 'DigitInput';
export default memo(DigitInput);
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  pinContainer: {
    height: 16,
  },
  inputItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.border6,
  },
  iconStyle: {
    width: 16,
    height: 16,
    backgroundColor: defaultColors.font5,
    borderRadius: 8,
  },
  inputStyle: {
    height: 45,
    zIndex: 99,
    position: 'absolute',
    opacity: 0,
  },
  errorText: {
    marginTop: 40,
    textAlign: 'center',
    color: defaultColors.error,
  },
  textStyles: {
    fontSize: 36,
    color: defaultColors.font5,
    fontWeight: 'bold',
  },
  pinPlaceholder: {
    height: 4,
    width: 16,
    backgroundColor: defaultColors.font5,
  },
  pinSecureText: {
    backgroundColor: defaultColors.font5,
    height: 16,
    width: 16,
    borderRadius: 8,
  },
});
