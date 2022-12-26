import React from 'react';
import { Text, View, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { storeData } from '../AsyncStorage/asyncStorageUtil';
import { styles } from '../Test.style';

export const SectionI18n: React.FC = () => {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.sectionContainer}>
      <Text>{t('Welcome to React')}</Text>
      <Button
        title={'i18n Change Language'}
        onPress={() => {
          const language = i18n.language === 'zh' ? 'en' : 'zh';
          i18n.changeLanguage(language);
          storeData('customLanguageCode', language);
        }}
      />
    </View>
  );
};
