import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import Svg from 'components/Svg';
import { styles } from './style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppCASelector } from '@portkey/hooks/index';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import ActivityButton from 'pages/DashBoard/ActivityButton';

import { TextM } from 'components/CommonText';
import navigationService from 'utils/navigationService';
import { defaultColors } from 'assets/theme';
import { useWallet } from 'hooks/store';
import useQrScanPermission from 'hooks/useQrScanPermission';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import crashlytics from '@react-native-firebase/crashlytics';

interface CardProps {
  balanceShow?: string;
  balanceUSD?: string | number;
}

const Card: React.FC<CardProps> = () => {
  const { t } = useLanguage();

  const { walletName, currentNetwork } = useWallet();
  const [, requestQrPermission] = useQrScanPermission();

  const { accountBalance } = useAppCASelector(state => state.assets);

  // warning dialog
  const showDialog = useCallback(
    () =>
      ActionSheet.alert({
        title: t('Enable Camera Access'),
        message: t('Cannot connect to the camera. Please make sure it is turned on'),
        buttons: [
          {
            title: t('Close'),
            type: 'solid',
          },
        ],
      }),
    [t],
  );

  return (
    <View style={styles.cardWrap}>
      <TouchableOpacity
        style={styles.refreshWrap}
        onPress={async () => {
          if (!(await requestQrPermission())) return showDialog();

          navigationService.navigate('QrScanner');
        }}>
        <Svg icon="scan" size={22} color={defaultColors.font2} />
      </TouchableOpacity>
      <Text style={styles.usdtBalance}>{currentNetwork === 'MAIN' ? `$${accountBalance}` : 'Dev Mode'}</Text>
      <TextM
        style={styles.accountName}
        onPress={() => {
          // AccountOverlay.showAccountInfo(currentAccount as AccountType);
          // crashlytics().crash();
          crashlytics().log('firebase error!');
          crashlytics().recordError(new Error('firebase error!'));
          crashlytics().crash();
        }}>
        {walletName}
      </TextM>
      <View style={styles.buttonGroupWrap}>
        <SendButton themeType="dashBoard" />
        <View style={styles.space} />
        <ReceiveButton themeType="dashBoard" />
        <View style={styles.space} />
        <ActivityButton themeType="dashBoard" />
      </View>
    </View>
  );
};

export default Card;
