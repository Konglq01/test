import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatChainInfo, formatStr2EllipsisStr, formatTransferTime } from 'utils';
import { pTd } from 'utils/unit';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { TransactionTypes, transactionTypesMap } from '@portkey-wallet/constants/constants-ca/activity';
import { unitConverter } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import { SvgUri } from 'react-native-svg';
import CommonButton from 'components/CommonButton';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import Loading from 'components/Loading';
import { CrossChainTransferParamsType, intervalCrossChainTransfer } from 'utils/transfer/crossChainTransfer';
import { useAppDispatch } from 'store/hooks';
import { removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getManagerAccount } from 'utils/redux';
import { usePin } from 'hooks/store';
import ActionSheet from 'components/ActionSheet';
import CommonToast from 'components/CommonToast';

interface ActivityItemPropsType {
  item?: ActivityItemType;
  onPress?: (item: any) => void;
}

const hiddenArr = [TransactionTypes.SOCIAL_RECOVERY, TransactionTypes.ADD_MANAGER, TransactionTypes.REMOVE_MANAGER];

const ActivityItem: React.FC<ActivityItemPropsType> = ({ item, onPress }) => {
  const { t } = useLanguage();
  const activity = useAppCASelector(state => state.activity);
  const tokenContractRef = useRef<ContractBasic>();
  const currentChainList = useCurrentChainList();
  const pin = usePin();
  const dispatch = useAppDispatch();

  const amountString = useMemo(() => {
    const { amount = '', isReceived, decimals = '', symbol } = item || {};
    let _amountString = '';
    if (amount) _amountString += isReceived ? '+' : '-';
    _amountString += unitConverter(ZERO.plus(amount).div(`1e${decimals}`));
    _amountString += symbol ? ` ${symbol}` : '';
    return _amountString;
  }, [item]);

  const showRetry = useCallback(
    (retryFunc: () => void) => {
      ActionSheet.alert({
        title: t('Transaction failed ！'),
        buttons: [
          {
            title: t('Resend'),
            type: 'solid',
            onPress: () => {
              retryFunc();
            },
          },
        ],
      });
    },
    [t],
  );

  const retryCrossChain = useCallback(
    async (managerTransferTxId: string, data: CrossChainTransferParamsType) => {
      const chainInfo = currentChainList?.find(chain => chain.chainId === data.tokenInfo.chainId);
      if (!chainInfo || !pin) return;
      const account = getManagerAccount(pin);
      if (!account) return;

      Loading.show();
      try {
        if (!tokenContractRef.current) {
          tokenContractRef.current = await getContractBasic({
            contractAddress: data.tokenInfo.address,
            rpcUrl: chainInfo.endPoint,
            account,
          });
        }
        const tokenContract = tokenContractRef.current;
        await intervalCrossChainTransfer(tokenContract, data);
        dispatch(removeFailedActivity(managerTransferTxId));
        CommonToast.success('success');
      } catch (error) {
        showRetry(() => {
          retryCrossChain(managerTransferTxId, data);
        });
      }
      Loading.hide();
    },
    [currentChainList, dispatch, pin, showRetry],
  );

  const onResend = useCallback(() => {
    const { params } = activity.failedActivityMap[item?.transactionId || ''];
    retryCrossChain(item?.transactionId || '', params);
  }, [activity.failedActivityMap, item?.transactionId, retryCrossChain]);

  return (
    <TouchableOpacity style={itemStyle.itemWrap} onPress={() => onPress?.(item)}>
      <Text style={itemStyle.time}>{formatTransferTime(Number(item?.timestamp) * 1000)}</Text>
      <View style={itemStyle.contentWrap}>
        {<SvgUri style={itemStyle.left} width={pTd(32)} height={pTd(32)} uri={item?.listIcon || ''} />}

        <View style={itemStyle.center}>
          <Text style={itemStyle.centerType}>
            {item?.transactionType ? transactionTypesMap(item.transactionType, item.nftInfo?.nftId) : ''}
          </Text>
          <Text style={[itemStyle.centerStatus, FontStyles.font3]}>
            {t('From')}
            {':  '}
            {formatStr2EllipsisStr(item?.fromAddress, 10)}
          </Text>

          {item?.transactionType && !hiddenArr.includes(item?.transactionType) && (
            <Text style={[itemStyle.centerStatus, FontStyles.font3]}>
              {formatChainInfo(item?.fromChainId)}
              {'-->'}
              {formatChainInfo(item?.toChainId)}
            </Text>
          )}
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
      {activity.failedActivityMap[item?.transactionId || ''] && (
        <View style={itemStyle.btnWrap}>
          <CommonButton
            title="Resend"
            type="primary"
            buttonStyle={itemStyle.resendWrap}
            titleStyle={itemStyle.resendTitle}
            onPress={onResend}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(ActivityItem);

const itemStyle = StyleSheet.create({
  itemWrap: {
    ...GStyles.paddingArg(12, 20),
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    marginTop: StyleSheet.hairlineWidth,
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
  btnWrap: {
    alignItems: 'flex-end',
  },
  resendWrap: {
    height: pTd(24),
    width: pTd(65),
    padding: 0,
  },
  resendTitle: {
    fontSize: pTd(12),
  },
});
