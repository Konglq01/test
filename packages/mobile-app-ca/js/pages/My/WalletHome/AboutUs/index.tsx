import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { TextM, TextXXXL } from 'components/CommonText';
import * as Application from 'expo-application';
import MenuItem from '../../components/MenuItem';

const AboutUs = () => {
  const { t } = useLanguage();
  return (
    <PageContainer
      titleDom={t('About Us')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={styles.pageContainer}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.logoWrap}>
        <Svg icon="app-blue-logo" oblongSize={[pTd(48.89), pTd(48.89)]} />
      </View>
      <TextXXXL>Portkey</TextXXXL>
      <TextM style={styles.version}>V {Application.nativeApplicationVersion}</TextM>

      <View style={styles.btnContainer}>
        <MenuItem
          icon="twitter"
          title="Follow us on Twitter"
          onPress={() => {
            //
          }}
        />
        <MenuItem
          icon="discord"
          title="Join us on Discord"
          onPress={() => {
            //
          }}
        />
      </View>

      <MenuItem
        icon="terms"
        title="Terms of Service"
        onPress={() => {
          //
        }}
      />
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
    flex: 1,
  },
  logoWrap: {
    width: pTd(80),
    height: pTd(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(16),
    borderWidth: 1,
    borderColor: defaultColors.border6,
    marginTop: pTd(48),
    marginBottom: pTd(16),
    backgroundColor: defaultColors.bg1,
  },
  version: {
    marginTop: pTd(8),
    fontSize: pTd(14),
    lineHeight: pTd(20),
    color: defaultColors.font3,
    marginBottom: pTd(48),
  },
  btnContainer: {
    backgroundColor: defaultColors.bg1,
    width: '100%',
    borderRadius: pTd(6),
    marginBottom: pTd(24),
  },
  innerBtnWrap: {
    marginBottom: 0,
  },
});
