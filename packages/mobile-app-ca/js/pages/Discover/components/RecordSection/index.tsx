import { TextL, TextS } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function RecordsSection() {
  const { t } = useLanguage();

  return (
    <View>
      <View style={styles.header}>
        <TextL>{t('Records')}</TextL>
        <TextS>{t('Clear')}</TextS>
      </View>
      <FlatList renderItem={() => <TextS>1</TextS>} data={[1, 2, 3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {},
});
