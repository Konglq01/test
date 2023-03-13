import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import TransferItem from 'components/TransferList/components/TransferItem';

import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import NoData from 'components/NoData';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { transactionTypesForActivityList } from '@portkey-wallet/constants/constants-ca/activity';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';

interface RouterParams {
  chainId?: string;
  symbol?: string;
}

const ActivityListPage = () => {
  const { chainId, symbol } = useRouterParams<RouterParams>();
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const activity = useAppCASelector(state => state.activity);
  const currentActivity = activity?.activityMap?.[getCurrentActivityMapKey(chainId, symbol)];
  const currentWallet = useCurrentWallet();
  const isLoadingRef = useRef(false);
  const getActivityList = async (isInit: boolean) => {
    const { data, maxResultCount, skipCount, totalRecordCount } = currentActivity;
    if (!isInit && data.length >= totalRecordCount) return;
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setRefreshing(true);
    const params: IActivitiesApiParams = {
      maxResultCount: maxResultCount,
      skipCount: isInit ? 0 : skipCount + maxResultCount,
      caAddresses: currentWallet.walletInfo.caAddressList,
      // managerAddresses: address,
      chainId: chainId,
      symbol: symbol,
      transactionTypes: transactionTypesForActivityList,
    };
    await dispatch(getActivityListAsync(params));
    setRefreshing(false);
    isLoadingRef.current = false;
  };

  useEffectOnce(() => {
    getActivityList(true);
  });

  const renderItem = useCallback(({ item }: { item: ActivityItemType }) => {
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
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  return (
    <PageContainer
      titleDom={t('Activity')}
      safeAreaColor={['blue', 'white']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {!currentActivity?.totalRecordCount && !refreshing && (
        <NoData message={t('You have no transactions.')} topDistance={pTd(160)} />
      )}
      {currentActivity?.data && (
        <FlatList
          refreshing={refreshing}
          data={currentActivity?.data || []}
          keyExtractor={(_item: ActivityItemType, index: number) => `${index}`}
          renderItem={renderItem}
          onRefresh={() => getActivityList(true)}
          onEndReached={() => getActivityList(false)}
        />
      )}
    </PageContainer>
  );
};

export default ActivityListPage;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  noResult: {},
});
