import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextXXXL } from 'components/CommonText';
import SafeAreaBox from 'components/SafeAreaBox';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { windowHeight, screenWidth, isIos } from 'utils/device';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import background from './img/background.png';
export default function Entrance() {
  const { t } = useLanguage();
  return (
    <ImageBackground resizeMode="cover" style={styles.imgBox} source={background}>
      <SafeAreaBox style={styles.safeAreaBox}>
        <CommonButton
          containerStyle={GStyles.paddingTop(pTd(16))}
          type="outline"
          onPress={() => navigationService.navigate('ImportWallet')}>
          {t('Access Existing Wallet')}
        </CommonButton>
        <CommonButton onPress={() => navigationService.navigate('CreateWallet')}>
          {t('Create a New Wallet')}
        </CommonButton>
        <View style={[GStyles.alignCenter, GStyles.itemCenter]}>
          <Svg size={screenWidth * 0.26} icon="logo-icon" />
          <TextXXXL style={styles.titleStyles}>{t('Welcome to Portkey')}</TextXXXL>
        </View>
      </SafeAreaBox>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imgBox: {
    flex: 1,
  },
  safeAreaBox: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column-reverse',
    paddingBottom: windowHeight * 0.07 + (!isIos ? pTd(20) : 0),
    paddingHorizontal: pTd(24),
  },
  titleStyles: {
    marginTop: windowHeight * 0.08,
    color: defaultColors.font2,
    marginBottom: windowHeight * 0.22,
  },
});
