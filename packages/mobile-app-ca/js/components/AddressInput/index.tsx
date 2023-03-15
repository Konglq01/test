import React from 'react';
import { Input, InputProps } from '@rneui/themed';
import { Text, View } from 'react-native';
import { generalStyles } from './style';
import { TextM } from 'components/CommonText';
import { defaultColors } from 'assets/theme';

type AelfInputWithAffixProps = InputProps & {
  affix?: [string, string]; // prefix and suffix
};

const AelfInputWithAffix: React.FC<AelfInputWithAffixProps> = props => {
  const { placeholder = 'send', errorMessage = '', affix = ['ELF', 'AELF'] } = props;

  return (
    <View>
      <View style={generalStyles.outerWrap}>
        <View style={[generalStyles.commonFix, generalStyles.prefix]}>
          <TextM>{affix[0]}</TextM>
        </View>
        <Input
          selectionColor={defaultColors.bg14}
          containerStyle={generalStyles.containerStyle}
          inputContainerStyle={generalStyles.inputContainerStyle}
          inputStyle={generalStyles.inputStyle}
          rightIconContainerStyle={generalStyles.rightIconContainerStyle}
          placeholder={placeholder}
          disabledInputStyle={generalStyles.disabledInputStyle}
          {...props}
        />
        <View style={[generalStyles.commonFix, generalStyles.suffix]}>
          <TextM>{affix[1]}</TextM>
        </View>
      </View>
      <Text style={generalStyles.errorStyle}>{errorMessage}</Text>
    </View>
  );
};

export default AelfInputWithAffix;
