import React from 'react';
import { StyleSheet } from 'react-native';
import { TextM } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';

export default function ListEmptyComponent({ isSearch }: { isSearch?: boolean }) {
  const { t } = useLanguage();
  return (
    <>
      {isSearch && (
        <TextM style={[styles.emptyText, GStyles.alignCenter, GStyles.marginTop(40)]}>
          {t('There is no search result.')}
        </TextM>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    color: defaultColors.font7,
  },
});
