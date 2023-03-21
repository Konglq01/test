import React, { forwardRef } from 'react';
import { Input, InputProps } from '@rneui/themed';
import Svg from 'components/Svg';
import { generalStyles, searchStyle, bgWhiteStyles } from './style';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';

type CommonInputProps = InputProps & { type?: 'search' | 'general'; theme?: 'white-bg' | 'gray-bg' };

const CommonInput = forwardRef(function CommonInput(props: CommonInputProps, forwardedRef: any) {
  const { t } = useLanguage();
  const {
    placeholder,
    type = 'search',
    theme = 'gray-bg',
    inputStyle,
    containerStyle,
    inputContainerStyle,
    labelStyle,
    rightIconContainerStyle,
    leftIconContainerStyle,
    ...inputProps
  } = props;

  if (type === 'search')
    return (
      <Input
        containerStyle={[searchStyle.containerStyle, containerStyle]}
        inputContainerStyle={[searchStyle.inputContainerStyle, inputContainerStyle]}
        inputStyle={[searchStyle.inputStyle, inputStyle]}
        labelStyle={[searchStyle.labelStyle, labelStyle]}
        rightIconContainerStyle={[searchStyle.rightIconContainerStyle, rightIconContainerStyle]}
        leftIconContainerStyle={[searchStyle.leftIconContainerStyle, leftIconContainerStyle]}
        placeholder={placeholder || t('Please enter')}
        leftIcon={<Svg icon="search" size={pTd(15)} />}
        {...inputProps}
        ref={forwardedRef}
      />
    );

  return (
    <Input
      containerStyle={[generalStyles.containerStyle, containerStyle]}
      inputContainerStyle={[
        generalStyles.inputContainerStyle,
        theme === 'white-bg' && bgWhiteStyles.inputContainerStyle,
        inputContainerStyle,
      ]}
      inputStyle={[generalStyles.inputStyle, inputStyle]}
      labelStyle={[generalStyles.labelStyle, labelStyle]}
      rightIconContainerStyle={[generalStyles.rightIconContainerStyle, rightIconContainerStyle]}
      leftIconContainerStyle={leftIconContainerStyle}
      errorStyle={[generalStyles.errorStyle]}
      placeholder={placeholder || t('Please enter')}
      disabledInputStyle={[generalStyles.disabledInputStyle]}
      {...inputProps}
      ref={forwardedRef}
    />
  );
});
export default CommonInput;
