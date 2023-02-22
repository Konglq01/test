import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { useLanguage } from 'i18n/hooks';
import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatChainInfo, formatStr2EllipsisStr, formatTransferTime } from 'utils';
import { pTd } from 'utils/unit';
import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { TransactionTypes, transactionTypesMap } from '@portkey/constants/constants-ca/activity';
import { unitConverter } from '@portkey/utils/converter';
import { ZERO } from '@portkey/constants/misc';

interface ActivityItemPropsType {
  item?: ActivityItemType;
  onPress?: (item: any) => void;
}

const ActivityItem: React.FC<ActivityItemPropsType> = ({ item, onPress }) => {
  const { t } = useLanguage();

  const amountString = useMemo(() => {
    const { amount = '', isReceived, decimals = '', symbol } = item || {};
    let _amountString = '';
    if (amount) _amountString += isReceived ? '+' : '-';
    _amountString += unitConverter(ZERO.plus(amount).div(`1e${decimals}`));
    _amountString += symbol ? ` ${symbol}` : '';
    return _amountString;
  }, [item]);

  const activityListLeftIcon = (type?: TransactionTypes) => {
    if (!type) return 'transfer';
    const loginRelatedTypeArr = [
      TransactionTypes.ADD_MANAGER,
      TransactionTypes.REMOVE_MANAGER,
      TransactionTypes.SOCIAL_RECOVERY,
    ];
    return loginRelatedTypeArr.includes(type) ? 'social-recovery' : 'transfer';
  };

  return (
    <TouchableOpacity style={itemStyle.itemWrap} onPress={() => onPress?.(item)}>
      <Text style={itemStyle.time}>{formatTransferTime(Number(item?.timestamp) * 1000)}</Text>
      <View style={itemStyle.contentWrap}>
        <CommonAvatar
          style={itemStyle.left}
          title={item?.symbol || ''}
          // svgName="transfer"
          // TODO: dynamic icon
          svgName={activityListLeftIcon(item?.transactionType)}
          avatarSize={pTd(32)}
          color={defaultColors.primaryColor}
        />

        <View style={itemStyle.center}>
          {/* TODO:  sent and received not send */}
          <Text style={itemStyle.centerType}>
            {item?.transactionType ? transactionTypesMap(item.transactionType, item.nftInfo?.nftId) : ''}
          </Text>
          <Text style={[itemStyle.centerStatus, FontStyles.font3]}>
            {t('From')}
            {':  '}
            {formatStr2EllipsisStr(item?.isReceived ? item?.toAddress : item?.fromAddress, 10)}
          </Text>
          <Text style={[itemStyle.centerStatus, FontStyles.font3]}>
            {formatChainInfo(item?.fromChainId)}
            {'-->'}
            {formatChainInfo(item?.toChainId)}
          </Text>
        </View>

        <View style={itemStyle.right}>
          <Text style={[itemStyle.tokenBalance]}>
            {item?.nftInfo?.nftId ? `#${item?.nftInfo?.nftId}` : ''}
            {!item?.nftInfo?.nftId ? amountString : ''}
          </Text>
          {/* {currentNetwork === 'MAIN' && (
            <Text style={itemStyle.usdtBalance}>{`$ ${
              (Number(item?.amount) * Number(rate?.USDT)).toFixed(2) || 1000.0
            }`}</Text>
            <Text style={itemStyle.usdtBalance}>{`$ 1000.00`}</Text>
          )} */}
        </View>
      </View>
      {/* <CommonButton title={'aa'} /> */}
    </TouchableOpacity>
  );
};

export default memo(ActivityItem);

const itemStyle = StyleSheet.create({
  itemWrap: {
    ...GStyles.paddingArg(12, 20),
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
