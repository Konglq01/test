import { ZERO } from '@portkey/constants/misc';
import { unitConverter } from '@portkey/utils/converter';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextS } from 'components/CommonText';
import { IconName } from 'components/Svg';
import { useWallet } from 'hooks/store';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';

interface TokenListItemType {
  icon?: IconName;
  symbol?: string;
  item?: any;
  onPress?: (item: any) => void;
}

const TokenListItem: React.FC<TokenListItemType> = props => {
  const { icon = 'aelf-avatar', symbol = 'ELF', onPress, item } = props;
  const { currentNetwork } = useWallet();

  return (
    <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.(item)}>
      <CommonAvatar
        style={itemStyle.left}
        title={item?.token?.symbol}
        svgName={item?.token?.symbol === 'ELF' ? icon : undefined}
        avatarSize={pTd(48)}
      />
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <TextL numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.tokenName}>
            {item?.token?.symbol}
          </TextL>
          <TextS numberOfLines={1} style={[FontStyles.font7, itemStyle.chainInfo]}>
            {item?.chainId === 'AELF' ? 'MainChain ' : 'SideChain '} {item?.chainId}{' '}
            {currentNetwork === 'MAIN' && 'Testnet'}
          </TextS>
        </View>

        <View style={itemStyle.balanceWrap}>
          {/* <TextL style={itemStyle.token} numberOfLines={1} ellipsizeMode={'tail'}>{`${unitConverter(
            ZERO.plus(item.balance).div(`1e${item.decimals}`),
          )} ${item?.token?.symbol}`}</TextL> */}
          <TextL style={itemStyle.token} numberOfLines={1} ellipsizeMode={'tail'}>
            {item?.amount}
          </TextL>
          <TextS numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.dollar}>
            $ {item?.amountUsd}
          </TextS>
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
  infoWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  tokenName: {
    lineHeight: pTd(22),
  },
  chainInfo: {
    lineHeight: pTd(16),
    marginTop: pTd(2),
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
