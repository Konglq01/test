import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { IconName } from 'components/Svg';
import { useWallet } from 'hooks/store';
import { useLanguage } from 'i18n/hooks';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatStr2EllipsisStr, formatTransferTime } from 'utils';
import { pTd } from 'utils/unit';

type ItemType = {
  amount?: number | string;
  amount_o?: number | string;
  block: number | string;
  category: 'send' | 'receive';
  chain?: string; //AELF
  fee?: number | string; // 0.29
  feeSymbol?: string; // "ELF"
  from?: string; // "2GHgmYRXPyxTxmPF48kdbsMaiJhTU3PCZ65fmZzkGD8rEXRH7n"
  from_chainid?: string; //"AELF"
  memo?: string; //" "
  method?: string; // "crosschaintransfer"
  status?: number; // 1
  statusText?: string; //"Transferred"
  status_o: number; // 1
  symbol: string; //"ELF"
  time: string | number; //1667286912
  timeOffset: string; // "1667382114"
  to?: string; //"2GHgmYRXPyxTxmPF48kdbsMaiJhTU3PCZ65fmZzkGD8rEXRH7n"
  to_chainid?: string; //"tDVW"
  txid?: string; //"56f419061433f4102b1378127850096cc9cf8bcab60220162157734cf5a7ac18
};

interface TokenListItemType {
  icon?: IconName;
  symbol?: string;
  tokenBalance?: number | string;
  usdtBalance?: number | string;
  rate?: { USDT: string | number };
  item?: ItemType;
  onPress?: (item: any) => void;
}

const ActivityItem: React.FC<TokenListItemType> = props => {
  const { rate, onPress, item } = props;
  const { t } = useLanguage();

  const { currentNetwork } = useWallet();
  // console.log(item);

  return (
    <TouchableOpacity style={itemStyle.itemWrap} onPress={() => onPress?.(item)}>
      <Text style={itemStyle.time}>{formatTransferTime(Date.now())}</Text>
      <View style={itemStyle.contentWrap}>
        <CommonAvatar
          style={itemStyle.left}
          title={item?.symbol || ''}
          // svgName="transfer"
          svgName="social-recovery"
          avatarSize={pTd(32)}
          color={defaultColors.primaryColor}
        />

        <View style={itemStyle.center}>
          {/* TODO:  sent and received not send */}
          <Text style={itemStyle.centerType}>{t('Transfer')}</Text>
          <Text style={[itemStyle.centerStatus, FontStyles.font3]}>
            {t('From')}
            {':  '}
            {formatStr2EllipsisStr('0x46f4e431f49adsadasdas5b78d135a26', 12)}
          </Text>
          <Text style={[itemStyle.centerStatus, FontStyles.font3]}>
            {'MainChain AELF'}
            {'-->'}
            {'MainChain tDVV'}
          </Text>
        </View>

        <View style={itemStyle.right}>
          <Text style={[itemStyle.tokenBalance]}>{`${item?.amount} ${item?.symbol || 'ELF'}`}</Text>
          {currentNetwork === 'MAIN' && (
            // <Text style={itemStyle.usdtBalance}>{`$ ${
            //   (Number(item?.amount) * Number(rate?.USDT)).toFixed(2) || 1000.0
            // }`}</Text>
            <Text style={itemStyle.usdtBalance}>{`$ 1000.00`}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ActivityItem);

const itemStyle = StyleSheet.create({
  itemWrap: {
    ...GStyles.paddingArg(12, 20),
    height: pTd(100),
    width: '100%',
    borderBottomWidth: pTd(0.5),
    borderBottomColor: defaultColors.bg7,
    backgroundColor: defaultColors.bg1,
  },
  time: {
    fontSize: pTd(10),
    color: defaultColors.font3,
  },
  contentWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(74),
  },
  left: {
    marginRight: pTd(18),
    width: pTd(32),
    height: pTd(32),
    borderWidth: 0,
  },
  center: {
    flex: 1,
  },
  centerType: {
    color: defaultColors.font5,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  centerStatus: {
    color: defaultColors.font10,
    marginTop: pTd(1),
    fontSize: pTd(10),
    lineHeight: pTd(16),
  },
  tokenBalance: {
    textAlign: 'right',
    color: defaultColors.font5,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  usdtBalance: {
    textAlign: 'right',
    lineHeight: pTd(16),
    fontSize: pTd(10),
    color: defaultColors.font5,
  },
  right: {
    display: 'flex',
    height: '100%',
    marginTop: pTd(12),
  },
  tokenName: {
    flex: 1,
  },
});
