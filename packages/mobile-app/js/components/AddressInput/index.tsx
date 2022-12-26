import React from 'react';
import { Input, InputProps } from '@rneui/themed';
import { Text, View } from 'react-native';
import { generalStyles } from './style';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';

type AelfInputWithAffixProps = InputProps & {
  affix?: [string, string]; // prefix and suffix
};

const AelfInputWithAffix: React.FC<AelfInputWithAffixProps> = props => {
  const { placeholder = 'send', errorMessage = '', affix = ['ELF', 'AELF'] } = props;
  const { t } = useLanguage();

  return (
    <View>
      <TextM style={generalStyles.labelStyle}>{t('Address')}</TextM>
      <View style={generalStyles.outerWrap}>
        <TextM style={{ ...generalStyles.commonFix, ...generalStyles.prefix }}>{affix[0]}</TextM>
        <TextM style={[generalStyles.commonDivider, generalStyles.leftDivider]} />
        <Input
          containerStyle={generalStyles.containerStyle}
          inputContainerStyle={generalStyles.inputContainerStyle}
          inputStyle={generalStyles.inputStyle}
          rightIconContainerStyle={generalStyles.rightIconContainerStyle}
          placeholder={placeholder}
          disabledInputStyle={generalStyles.disabledInputStyle}
          {...props}
        />
        <View style={[generalStyles.commonDivider, generalStyles.rightDivider]} />
        <TextM style={{ ...generalStyles.commonFix, ...generalStyles.suffix }}>{affix[1]}</TextM>
      </View>
      <Text style={generalStyles.errorStyle}>{errorMessage}</Text>
    </View>
  );
};

export default AelfInputWithAffix;
