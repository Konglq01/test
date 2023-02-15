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
  noBalanceShow?: boolean;
  item?: any;
  onPress?: (item: any) => void;
}

const TokenListItem: React.FC<TokenListItemType> = props => {
  const { icon = 'aelf-avatar', symbol = 'ELF', noBalanceShow = false, onPress, item } = props;
  const { currentNetwork } = useWallet();

  return (
    <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.(item)}>
      <CommonAvatar
        style={itemStyle.left}
        title={item?.symbol}
        svgName={item?.token?.symbol === 'ELF' ? icon : undefined}
        avatarSize={pTd(48)}
        imageUrl={item?.imageUrl}
      />
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <TextL numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.tokenName}>
            {item?.symbol}
          </TextL>
          <TextS numberOfLines={1} style={[FontStyles.font7, itemStyle.chainInfo]}>
            {item?.chainId === 'AELF' ? 'MainChain ' : 'SideChain '} {item?.chainId}{' '}
            {currentNetwork === 'TESTNET' && 'Testnet'}
          </TextS>
        </View>

        {!noBalanceShow && (
          <View style={itemStyle.balanceWrap}>
            <TextL style={itemStyle.token} numberOfLines={1} ellipsizeMode={'tail'}>
              {unitConverter(ZERO.plus(item?.balance).div(`1e${item.decimal}`))}
            </TextL>
            <TextS numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.dollar}>
              $ {unitConverter(ZERO.plus(item?.balanceInUsd).div(`1e${item.decimal}`))}
            </TextS>
          </View>
        )}
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
    width: pTd(150),
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
