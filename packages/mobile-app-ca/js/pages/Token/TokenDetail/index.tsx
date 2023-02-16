import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
// import { Dialog } from '@rneui/base';
import PageContainer from 'components/PageContainer';
import { unitConverter } from '@portkey/utils/converter';
import { ZERO } from '@portkey/constants/misc';
import { useAppCASelector, useAppCommonDispatch } from '@portkey/hooks/index';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';

import navigationService from 'utils/navigationService';
import NoData from 'components/NoData';
import { useLanguage } from 'i18n/hooks';
import TransferItem from 'components/TransferList/components/TransferItem';

import { FlashList } from '@shopify/flash-list';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextXL } from 'components/CommonText';
import { getActivityListAsync } from '@portkey/store/store-ca/activity/action';
import useEffectOnce from 'hooks/useEffectOnce';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { useWallet } from 'hooks/store';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { request } from '@portkey/api/api-did';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import { skipToken } from '@reduxjs/toolkit/dist/query';

interface RouterParams {
  tokenInfo: TokenItemShowType;
}

enum TransactionTypes {
  'Transfer',
  'CrossChainTransfer',
  'CrossChainReceiveToken',
  'SocialRecovery',
  'RemoveManager',
  'AddManager',
}
const transactionList: TransactionTypes[] = [
  TransactionTypes.AddManager,
  TransactionTypes.CrossChainReceiveToken,
  TransactionTypes.CrossChainTransfer,
  TransactionTypes.RemoveManager,
  TransactionTypes.SocialRecovery,
  TransactionTypes.Transfer,
];
const maxResultCount = 10;

const TokenDetail: React.FC = () => {
  const { t } = useLanguage();
  const { tokenInfo } = useRouterParams<RouterParams>();

  console.log('====================================');
  console.log(tokenInfo);
  console.log('====================================');

  const currentWallet = useCurrentWallet();

  const navigation = useNavigation();

  const dispatch = useAppCommonDispatch();

  const activity = useAppCASelector(state => state.activity);

  // const [list, setList] = useState<any[]>([]);
  const [listShow, setListShow] = useState<any[]>([]);

  // const { balances } = useAppCASelector(state => state.tokenBalance);

  const [currentToken] = useState<TokenItemShowType>(tokenInfo);
  const [skipCount, setSkipCount] = useState<number>(0);
  const [totalRecordCount, setTotalRecordCount] = useState<number>(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(true); // first time

  // TODO: upDate balance
  // const upDateBalance = async () => {
  // };

  useEffect(() => {
    setListShow(activity.list);
  }, [activity]);

  useEffectOnce(() => {
    dispatch(getActivityListAsync({ type: 'MAIN' }));
  });

  // const balanceFormat = useCallback((symbol: string, decimals = 8) => ZERO.plus('0').div(`1e${decimals}`), []);

  const fixedParamObj = useMemo(
    () => ({
      caAddresses: currentWallet.walletInfo.caAddressList,
      transactionTypes: transactionList,
      symbol: tokenInfo.symbol,
      chainId: tokenInfo.chainId,
    }),
    [currentWallet.walletInfo.caAddressList, tokenInfo.chainId, tokenInfo.symbol],
  );

  const getMoreActivityList = useCallback(() => {
    request.assets
      .fetchActivityList({
        params: {
          ...fixedParamObj,
          skipCount,
        },
      })
      .then(res => {
        setSkipCount(skipCount + maxResultCount);
        setListShow([...listShow, ...res?.data?.data]);

        setNoMoreData(res?.data.totalRecordCount > 0 && res?.data.totalRecordCount <= skipCount);
      })
      .catch(err => {
        CommonToast.fail(err);
      });
  }, [skipCount, fixedParamObj, listShow]);

  const initActivityList = useCallback(() => {
    setInitializing(true);
    request.assets
      .fetchActivityList({
        params: {
          ...fixedParamObj,
          skipCount: 0,
        },
      })
      .then(res => {
        setInitializing(false);

        setTotalRecordCount(res?.data.totalRecordCount);
        setListShow(res?.data?.data);

        setNoMoreData(res?.data.totalRecordCount > 0 && res?.data.totalRecordCount <= skipCount);
      })
      .catch(err => {
        setInitializing(false);
        setListShow([]);
        CommonToast.fail(err);
      });
  }, [skipCount, fixedParamObj]);

  useEffectOnce(() => initActivityList());

  return (
    <PageContainer
      type="leftBack"
      backTitle={t('')}
      titleDom={
        <View>
          <TextXL style={[GStyles.textAlignCenter, FontStyles.font2]}>{tokenInfo.symbol}</TextXL>
          <Text style={[GStyles.textAlignCenter, FontStyles.font2, styles.subTitle]}>{`${
            tokenInfo.chainId === 'AELF' ? 'MainChain' : 'SideChain'
          } ${tokenInfo.chainId}`}</Text>
        </View>
      }
      safeAreaColor={['blue', 'white']}
      leftCallback={() => navigation.goBack()}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.card}>
        <Text style={styles.tokenBalance}>{`${tokenInfo.balance} ${tokenInfo.symbol}`}</Text>
        {/* TODO : multiply rate */}
        {currentWallet?.currentNetwork === 'MAIN' && (
          <Text style={styles.dollarBalance}>{`$ ${tokenInfo?.balanceInUsd}`}</Text>
        )}
        <View style={styles.buttonGroupWrap}>
          <SendButton themeType="innerPage" sentToken={currentToken} />
          <View style={styles.space} />
          <ReceiveButton themeType="innerPage" receiveButton={currentToken} />
        </View>
      </View>
      {/* first time loading  */}
      {/* {isLoadingFirstTime && <Dialog.Loading />} */}
      {listShow.length === 0 && <NoData noPic message="You have no transactions." />}
      <FlashList
        data={listShow || []}
        renderItem={() => {
          return <TransferItem onPress={() => navigationService.navigate('ActivityDetail')} />;
        }}
        onRefresh={() => {
          setInitializing(true);
          initActivityList();
          // TODO: refresh Token Balance
        }}
        onEndReached={() => {
          if (noMoreData) return false;
          if (isLoadingMore) return false;

          setIsLoadingMore(true);
          getMoreActivityList();
        }}
      />
    </PageContainer>
  );
};

export default TokenDetail;
