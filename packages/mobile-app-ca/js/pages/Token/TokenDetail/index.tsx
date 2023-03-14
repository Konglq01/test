import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import PageContainer from 'components/PageContainer';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import useEffectOnce from 'hooks/useEffectOnce';

import navigationService from 'utils/navigationService';
import NoData from 'components/NoData';
import { useLanguage } from 'i18n/hooks';
import TransferItem from 'components/TransferList/components/TransferItem';
import { FlashList } from '@shopify/flash-list';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextXL } from 'components/CommonText';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { unitConverter } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import { transactionTypesForActivityList as transactionList } from '@portkey-wallet/constants/constants-ca/activity';
import fonts from 'assets/theme/fonts';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';

interface RouterParams {
  tokenInfo: TokenItemShowType;
}

const INIT_PAGE_INFO = {
  curPage: 0,
  total: 0,
  isLoading: false,
};

const TokenDetail: React.FC = () => {
  const { t } = useLanguage();
  const { tokenInfo } = useRouterParams<RouterParams>();
  const currentWallet = useCurrentWallet();
  const navigation = useNavigation();
  const dispatch = useAppCommonDispatch();
  const activity = useAppCASelector(state => state.activity);
  const { accountToken } = useAppCASelector(state => state.assets);

  const [reFreshing, setFreshing] = useState(false);

  const currentActivity = useMemo(
    () => activity?.activityMap?.[getCurrentActivityMapKey(tokenInfo.chainId, tokenInfo.symbol)] ?? {},
    [activity?.activityMap, tokenInfo.chainId, tokenInfo.symbol],
  );

  const currentToken = useMemo(() => {
    return accountToken.accountTokenList.find(
      ele => ele.symbol === tokenInfo.symbol && ele.chainId === tokenInfo.chainId,
    );
  }, [accountToken.accountTokenList, tokenInfo.chainId, tokenInfo.symbol]);

  const fixedParamObj = useMemo(
    () => ({
      caAddresses: currentWallet.walletInfo.caAddressList,
      transactionTypes: transactionList,
      symbol: tokenInfo.symbol,
      chainId: tokenInfo.chainId,
    }),
    [currentWallet.walletInfo.caAddressList, tokenInfo.chainId, tokenInfo.symbol],
  );
  const pageInfoRef = useRef({
    ...INIT_PAGE_INFO,
  });

  const getActivityList = useCallback(
    async (isInit = false) => {
      const { data, maxResultCount = 10, skipCount = 0, totalRecordCount = 0 } = currentActivity || {};
      if (!isInit && data?.length >= totalRecordCount) return;
      if (pageInfoRef.current.isLoading) return;
      pageInfoRef.current.isLoading = true;
      const params: IActivitiesApiParams = {
        ...fixedParamObj,
        skipCount: isInit ? 0 : skipCount + maxResultCount,
        maxResultCount,
      };
      await dispatch(getActivityListAsync(params));
      pageInfoRef.current.isLoading = false;
    },
    [currentActivity, dispatch, fixedParamObj],
  );

  const onRefreshList = useCallback(async () => {
    pageInfoRef.current = {
      ...INIT_PAGE_INFO,
    };
    setFreshing(true);
    await getActivityList(true);
    setFreshing(false);
  }, [getActivityList]);

  const balanceShow = `${unitConverter(ZERO.plus(currentToken?.balance || 0).div(`1e${currentToken?.decimals && 8}`))}`;

  useEffectOnce(() => {
    getActivityList(true);
  });

  useEffectOnce(() => {
    dispatch(fetchTokenListAsync({ caAddresses: currentWallet.walletInfo.caAddressList || [] }));
  });

  return (
    <PageContainer
      type="leftBack"
      backTitle={t('')}
      titleDom={
        <View>
          <TextXL style={[GStyles.textAlignCenter, FontStyles.font2, fonts.mediumFont]}>{tokenInfo.symbol}</TextXL>
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
        <Text style={styles.tokenBalance}>{`${balanceShow} ${currentToken?.symbol}`}</Text>
        {/* TODO : multiply rate */}
        {currentWallet?.currentNetwork === 'MAIN' && (
          <Text style={styles.dollarBalance}>{`$ ${currentToken?.balanceInUsd}`}</Text>
        )}
        <View style={styles.buttonGroupWrap}>
          <SendButton themeType="innerPage" sentToken={currentToken} />
          <View style={styles.space} />
          <ReceiveButton currentTokenInfo={currentToken} themeType="innerPage" receiveButton={currentToken} />
        </View>
      </View>

      <FlashList
        refreshing={reFreshing}
        data={currentActivity?.data || []}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={<NoData noPic message="You have no transactions." />}
        renderItem={({ item }: { item: ActivityItemType }) => {
          return (
            <TransferItem
              item={item}
              onPress={() =>
                navigationService.navigate('ActivityDetail', {
                  transactionId: item.transactionId,
                  blockHash: item.blockHash,
                  isReceived: item.isReceived,
                })
              }
            />
          );
        }}
        onRefresh={() => {
          onRefreshList();
        }}
        onEndReached={() => {
          getActivityList();
        }}
      />
    </PageContainer>
  );
};

export default TokenDetail;
