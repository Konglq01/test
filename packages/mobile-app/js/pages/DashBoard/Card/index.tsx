import React from 'react';
import { View, Text } from 'react-native';
import Svg from 'components/Svg';
import { styles } from './style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AccountOverlay from 'components/AccountOverlay';
import { AccountType } from '@portkey-wallet/types/wallet';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import { TextM } from 'components/CommonText';
import { useAppEOASelector } from '@portkey-wallet/hooks/hooks-eoa';

interface CardProps {
  balanceShow: string;
  symbolShow: string;
}

const Card: React.FC<CardProps> = props => {
  const { balanceShow } = props;
  const { currentAccount } = useAppEOASelector(state => state.wallet);
  return (
    <View style={styles.cardWrap}>
      <TouchableOpacity
        style={styles.refreshWrap}
        onPress={() => {
          AccountOverlay.showAccountList();
        }}>
        <Svg icon="refresh" size={22} />
      </TouchableOpacity>
      <Text style={styles.usdtBalance}>${balanceShow}</Text>
      <TextM
        style={styles.accountName}
        onPress={() => {
          AccountOverlay.showAccountInfo(currentAccount as AccountType);
        }}>
        {currentAccount?.accountName}
      </TextM>
      <View style={styles.buttonGroupWrap}>
        <SendButton themeType="dashBoard" />
        <View style={styles.space} />
        <ReceiveButton themeType="dashBoard" />
      </View>
    </View>
  );
};

export default Card;
