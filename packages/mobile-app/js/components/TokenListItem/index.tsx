import { ZERO } from '@portkey-wallet/constants/misc';
import { unitConverter } from '@portkey-wallet/utils/converter';
import { defaultColors } from 'assets/theme';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextS } from 'components/CommonText';
import { IconName } from 'components/Svg';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';

interface TokenListItemType {
  icon?: IconName;
  symbol?: string;
  rate?: { USDT: number };
  item?: any;
  onPress?: (item: any) => void;
}

const TokenListItem: React.FC<TokenListItemType> = props => {
  const { icon = 'aelf-avatar', symbol = 'ELF', onPress, item, rate = { USDT: 0 } } = props;

  return (
    <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.(item)}>
      <CommonAvatar
        style={itemStyle.left}
        title={symbol}
        svgName={symbol === 'ELF' ? icon : undefined}
        avatarSize={pTd(48)}
      />
      <View style={itemStyle.right}>
        <TextL numberOfLines={1} ellipsizeMode={'tail'}>
          {symbol}
        </TextL>
        <View style={itemStyle.balanceWrap}>
          <TextL style={itemStyle.token} numberOfLines={1} ellipsizeMode={'tail'}>{`${unitConverter(
            ZERO.plus(item.balance).div(`1e${item.decimals}`),
          )} ${item.symbol}`}</TextL>
          {item.symbol === 'ELF' && (
            <TextS numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.dollar}>
              $ {unitConverter(ZERO.plus(item.balance).div(`1e${item.decimals}`).times(rate?.USDT).toFixed(2))}
            </TextS>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(TokenListItem);

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(72),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    marginLeft: pTd(16),
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
