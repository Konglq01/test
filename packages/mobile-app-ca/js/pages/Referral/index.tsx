import { useGStyles } from 'assets/theme/useGStyles';
import React, { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import navigationService from 'utils/navigationService';
import { RootStackParamList } from 'navigation';
import SafeAreaBox from 'components/SafeAreaBox';
import { useCredentials } from 'hooks/store';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import Welcome from './components/Welcome';
import { ImageBackground, StyleSheet } from 'react-native';
import { isIos, screenHeight } from '@portkey/utils/mobile/device';
import background from '../Login/img/background.png';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { sleep } from '@portkey/utils';

export default function Referral() {
  const credentials = useCredentials();
  const { walletInfo } = useCurrentWallet();
  const gStyles = useGStyles();
  const { t } = useLanguage();
  const init = useCallback(async () => {
    if (!isIos) await sleep(200);
    await SplashScreen.hideAsync();
    if (walletInfo?.address) {
      let name: keyof RootStackParamList = 'SecurityLock';
      if (credentials) name = 'Tab';
      navigationService.reset(name);
    }
  }, [credentials, walletInfo?.address]);
  useEffect(() => {
    init();
  }, [init]);
  return (
    <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background}>
      <SafeAreaBox style={[gStyles.container, BGStyles.transparent]}>
        {!walletInfo?.address ? (
          <>
            <Welcome />
            <CommonButton
              buttonStyle={[GStyles.marginBottom(40), BGStyles.bg1]}
              titleStyle={FontStyles.font4}
              type="primary"
              title={t('Get Started')}
              onPress={() => navigationService.reset('LoginPortkey')}
            />
          </>
        ) : null}
      </SafeAreaBox>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    height: screenHeight,
  },
});
