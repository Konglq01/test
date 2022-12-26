import { defaultColors } from 'assets/theme';
import CommonAvatar from 'components/CommonAvatar';
import { IconName } from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatTransferTime } from 'utils';
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
  rate: { USDT: string | number };
  item?: ItemType;
  onPress?: (item: any) => void;
}

const ActivityItem: React.FC<TokenListItemType> = props => {
  const { rate, onPress, item } = props;
  const { t } = useLanguage();
  // console.log(item);

  const category = useMemo(() => {
    return `${item?.category[0].toUpperCase()}${item?.category.slice(1)}`;
  }, [item?.category]);
  return (
    <TouchableOpacity style={itemStyle.itemWrap} onPress={() => onPress?.(item)}>
      <Text style={itemStyle.time}>{formatTransferTime(Number(item?.time) * 1000)}</Text>
      <View style={itemStyle.contentWrap}>
        <CommonAvatar
          style={itemStyle.left}
          title={item?.symbol || ''}
          svgName={item?.category === 'send' ? 'transfer-send' : 'transfer-receive'}
          avatarSize={pTd(32)}
        />

        <View style={itemStyle.center}>
          {/* TODO:  sent and received not send */}

          <Text style={itemStyle.centerType}>{t(category === 'Send' ? 'Sent' : 'Received')}</Text>
          <Text style={itemStyle.centerStatus}>{t('Success')}</Text>
        </View>

        <View>
          <Text style={itemStyle.tokenBalance}>{`${item?.amount} ${item?.symbol}`}</Text>
          {item?.symbol === 'ELF' ? (
            <Text style={itemStyle.usdtBalance}>{`$ ${(Number(item?.amount) * Number(rate?.USDT)).toFixed(2)}`}</Text>
          ) : (
            <Text style={itemStyle.usdtBalance} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ActivityItem);

const itemStyle = StyleSheet.create({
  itemWrap: {
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    height: pTd(83),
    borderBottomWidth: pTd(0.5),
    borderBottomColor: defaultColors.bg7,
    backgroundColor: defaultColors.bg1,
  },
  time: {
    marginTop: pTd(13),
    fontSize: pTd(10),
    color: defaultColors.font3,
  },
  contentWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(57),
  },
  left: {
    marginRight: pTd(18),
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
    height: pTd(72),
    marginLeft: pTd(16),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: pTd(0.5),
  },
  tokenName: {
    flex: 1,
  },
  balanceWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  token: {
    color: defaultColors.font5,
    lineHeight: pTd(22),
    overflow: 'hidden',
  },
  dollar: {
    marginTop: pTd(2),
    lineHeight: pTd(16),
    color: defaultColors.font7,
  },
});
