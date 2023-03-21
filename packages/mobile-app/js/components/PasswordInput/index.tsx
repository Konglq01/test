import React, { forwardRef, memo, useState } from 'react';
import { InputProps } from '@rneui/base';
import CommonInput from 'components/CommonInput';
import Svg from 'components/Svg';
import { StyleProp, TextStyle, TouchableOpacity } from 'react-native';
const DefaultProps = {
  maxLength: 16,
  placeholder: 'Enter Password',
  type: 'general',
} as const;
const PasswordInput = forwardRef(function PasswordInput(
  props: InputProps & {
    proclaimInputStyle?: StyleProp<TextStyle>;
  },
  forwardedRef: any,
) {
  const { proclaimInputStyle, ...inputProps } = props;
  const [secure, setSecure] = useState<boolean>(true);
  const [key, setKey] = useState<number>(1);
  if (props.multiline && secure) {
    return (
      <CommonInput
        key={key}
        secureTextEntry={secure}
        rightIcon={
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Svg icon={!secure ? 'eye' : 'eyeClosed'} size={16} />
          </TouchableOpacity>
        }
        {...DefaultProps}
        {...inputProps}
        multiline={false}
        ref={forwardedRef}
      />
    );
  }
  return (
    <CommonInput
      secureTextEntry={secure}
      inputStyle={proclaimInputStyle}
      rightIcon={
        <TouchableOpacity
          onPress={() => {
            setKey(i => i + 1);
            setSecure(!secure);
          }}>
          <Svg icon={!secure ? 'eye' : 'eyeClosed'} size={16} />
        </TouchableOpacity>
      }
      {...DefaultProps}
      {...inputProps}
      ref={forwardedRef}
    />
  );
});
export default memo(PasswordInput);
