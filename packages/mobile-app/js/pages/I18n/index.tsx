import React from 'react';
import { Button, Text } from '@rneui/base';
import { useLanguage } from 'i18n/hooks';
import { View } from 'react-native';
import { LOCAL_LANGUAGE } from 'i18n/config';

export default function I18n() {
  const { language, changeLanguage, t } = useLanguage();
  return (
    <View>
      <Text>
        {language}
        {'\n'}
        {t('Welcome to React')}
        {'\n'}
        {'\n'}
      </Text>
      <Text>changeLanguage</Text>
      {LOCAL_LANGUAGE.map(item => {
        return (
          <Button key={item.language} onPress={() => changeLanguage(item.language)}>
            {item.title}
          </Button>
        );
      })}
    </View>
  );
}
