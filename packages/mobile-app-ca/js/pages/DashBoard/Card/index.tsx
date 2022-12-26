import React from 'react';
import { View, Text } from 'react-native';
import Svg from 'components/Svg';
import { styles } from './style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppCASelector } from '@portkey/hooks/index';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import ActivityButton from 'components/ActivityButton';

import { TextM } from 'components/CommonText';
import navigationService from 'utils/navigationService';
import { defaultColors } from 'assets/theme';
import { useWallet } from 'hooks/store';

interface CardProps {
  balanceShow?: string;
  balanceUSD?: string | number;
}

const Card: React.FC<CardProps> = () => {
  const { walletName, currentNetwork } = useWallet();

  const { accountBalance } = useAppCASelector(state => state.assets);

  return (
    <View style={styles.cardWrap}>
      <TouchableOpacity
        style={styles.refreshWrap}
        onPress={() => {
          navigationService.navigate('QrScanner');
        }}>
        <Svg icon="scan" size={22} color={defaultColors.font2} />
      </TouchableOpacity>
      <Text style={styles.usdtBalance}>{currentNetwork === 'MAIN' ? `$${accountBalance}` : 'Dev Mode'}</Text>
      <TextM
        style={styles.accountName}
        onPress={() => {
          // AccountOverlay.showAccountInfo(currentAccount as AccountType);
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
