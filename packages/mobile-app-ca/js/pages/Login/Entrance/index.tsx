import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import SafeAreaBox from 'components/SafeAreaBox';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { windowHeight, isIos } from '@portkey/utils/mobile/device';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import background from '../img/background.png';
export default function Entrance() {
  const { t } = useLanguage();
  return (
    <ImageBackground resizeMode="cover" style={styles.imgBox} source={background}>
      <SafeAreaBox style={styles.safeAreaBox}>
        <CommonButton
          containerStyle={GStyles.paddingTop(pTd(16))}
          type="outline"
          onPress={() => navigationService.navigate('SetPin')}>
          {t('SetPin')}
        </CommonButton>
        <CommonButton
          containerStyle={GStyles.paddingTop(pTd(16))}
          onPress={() => navigationService.navigate('SignupPortkey')}>
          {t('SignupPortkey')}
        </CommonButton>
        <CommonButton
          containerStyle={GStyles.paddingTop(pTd(16))}
          onPress={() => navigationService.navigate('InnerSettings')}>
          {t('InnerSettings')}
        </CommonButton>
        <CommonButton containerStyle={GStyles.paddingTop(pTd(16))} onPress={() => navigationService.navigate('Tab')}>
          {t('Tab')}
        </CommonButton>
        <CommonButton
          containerStyle={GStyles.paddingTop(pTd(16))}
          onPress={() => navigationService.navigate('SecurityLock')}>
          {t('SecurityLock')}
        </CommonButton>
        <CommonButton
          containerStyle={GStyles.paddingTop(pTd(16))}
          onPress={() => navigationService.navigate('LoginPortkey')}>
          {t('LoginPortkey')}
        </CommonButton>
        <CommonButton containerStyle={GStyles.paddingTop(pTd(16))} onPress={() => navigationService.navigate('Home')}>
          {t('Home')}
        </CommonButton>
        <CommonButton onPress={() => navigationService.navigate('VerifierDetails', { email: 'mason.huang@aelf.io' })}>
          {t('VerifierDetails')}
        </CommonButton>
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
