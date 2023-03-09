import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { TextM } from 'components/CommonText';
import * as Application from 'expo-application';

const AboutUs = () => {
  const { t } = useLanguage();
  return (
    <PageContainer titleDom={t('About Us')} safeAreaColor={['blue', 'gray']} containerStyles={styles.pageContainer}>
      <Svg icon="app-blue-logo" oblongSize={[pTd(62), pTd(64)]} iconStyle={styles.logo} />
      <TextM style={styles.version}>V {Application.nativeApplicationVersion}</TextM>
    </PageContainer>
  );
};

export default memo(AboutUs);

export const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: defaultColors.bg4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    marginTop: pTd(120),
    marginBottom: pTd(24),
  },
  version: {
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
});
