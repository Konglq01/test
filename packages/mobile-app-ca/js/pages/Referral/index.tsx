import { useGStyles } from 'assets/theme/useGStyles';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import navigationService from 'utils/navigationService';
import { RootStackParamList } from 'navigation';
import SafeAreaBox from 'components/SafeAreaBox';
import { useCredentials } from 'hooks/store';
import CommonButton from 'components/CommonButton';
import Guide from './components/Guide';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
export default function Referral() {
  const credentials = useCredentials();
  const { walletInfo } = useCurrentWallet();
  const gStyles = useGStyles();
  const { t } = useLanguage();
  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      if (walletInfo?.address) {
        let name: keyof RootStackParamList = 'SecurityLock';
        if (credentials) name = 'Tab';
        navigationService.reset(name);
      }
    }, 200);
    return () => {
      timer && clearTimeout(timer);
    };
  }, [credentials, walletInfo]);
  return (
    <SafeAreaBox style={gStyles.container}>
      {!walletInfo?.address ? (
        <>
          <Guide />
          <CommonButton
            style={GStyles.marginBottom(20)}
            type="primary"
            title={t('Get Start')}
            onPress={() => navigationService.reset('Entrance')}
          />
        </>
      ) : null}
    </SafeAreaBox>
  );
}
