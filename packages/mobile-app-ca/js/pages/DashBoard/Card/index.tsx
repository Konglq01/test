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

interface CardProps {
  balanceShow?: string;
  balanceUSD?: string | number;
}

const Card: React.FC<CardProps> = () => {
  const { t } = useLanguage();

  const { walletName, currentNetwork } = useWallet();
  const [, requestQrPermission] = useQrScanPermission();

  const { accountBalance } = useAppCASelector(state => state.assets);

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
      <View style={styles.refreshWrap}>
        <Text style={styles.block} />
        <TouchableOpacity
          onPress={async () => {
            if (!(await requestQrPermission())) return showDialog();
            navigationService.navigate('QrScanner');
          }}>
          <Svg icon="scan" size={22} color={defaultColors.font2} />
        </TouchableOpacity>
      </View>
      <Text style={styles.usdtBalance}>{currentNetwork === 'MAIN' ? `$${accountBalance}` : 'Dev Mode'}</Text>
      <TextM style={styles.accountName}>{walletName}</TextM>
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
