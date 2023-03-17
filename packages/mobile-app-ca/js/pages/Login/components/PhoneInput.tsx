import React from 'react';
import { Text, StyleSheet } from 'react-native';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import CommonInput from 'components/CommonInput';
import { CountryItem } from '@portkey-wallet/constants/constants-ca';
import { pTd } from 'utils/unit';

import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { InputProps } from '@rneui/themed';

interface PhoneInputProps extends InputProps {
  selectCountry?: CountryItem;
  onCountryChange?: (country: CountryItem) => void;
}

export default function PhoneInput({ selectCountry, onCountryChange, ...inputProps }: PhoneInputProps) {
  const { t } = useLanguage();

  useEffectOnce(() => {
    const countryListener = myEvents.setCountry.addListener((country: CountryItem) => {
      onCountryChange && onCountryChange(country);
    });
    return () => {
      countryListener.remove();
    };
  });
  return (
    <CommonInput
      leftIcon={
        <Touchable
          style={inputStyles.countryRow}
          onPress={() => navigationService.navigate('SelectCountry', { selectCountry })}>
          <Text>+ {selectCountry?.code}</Text>
          <Svg size={12} icon="down-arrow" />
        </Touchable>
      }
      type="general"
      maxLength={30}
      autoCorrect={false}
      // errorMessage={errorMessage}
      keyboardType="numeric"
      placeholder={t('Enter Phone Number')}
      // containerStyle={[styles.inputContainerStyle, containerStyle]}
      {...inputProps}
    />
  );
}

export const inputStyles = StyleSheet.create({
  countryRow: {
    height: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRightColor: defaultColors.border6,
    borderRightWidth: StyleSheet.hairlineWidth,
    marginLeft: pTd(16),
    paddingRight: pTd(10),
    width: pTd(68),
    justifyContent: 'space-between',
  },
});
