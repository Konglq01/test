import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
// import { GStyle, Colors } from '../../../../assets/theme';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import ListItem from 'components/ListItem';
import { useLanguage } from 'i18n/hooks';

const AboutUs = () => {
  const { t } = useLanguage();
  return (
    <PageContainer
      titleDom={t('About Us')}
      type="leftBack"
      safeAreaColor={['blue', 'gray']}
      containerStyles={styles.pageContainer}>
      <Svg icon="app-blue-logo" oblongSize={[pTd(62), pTd(64)]} iconStyle={styles.logo} />
      <Text style={styles.version}>1.0.0</Text>

      <View style={styles.listWrap}>
        <ListItem title={t('Terms of Service')} onPress={() => navigationService.navigate('TermsOfService')} />
      </View>
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
    marginTop: pTd(8),
    fontSize: pTd(14),
    color: defaultColors.font5,
  },
  listWrap: {
    marginTop: pTd(80),
  },
  list: {},
});
