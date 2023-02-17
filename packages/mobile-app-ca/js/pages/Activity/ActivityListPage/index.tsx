import React, { useEffect, useState, useCallback } from 'react';
import { Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import TransferItem from 'components/TransferList/components/TransferItem';

import { getActivityListAsync } from '@portkey/store/store-ca/activity/action';
import { useAppCASelector, useAppCommonDispatch } from '@portkey/hooks';
import NoData from 'components/NoData';
import { IActivitysApiParams } from '@portkey/store/store-ca/activity/type';
import { clearState } from '@portkey/store/store-ca/activity/slice';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { transactionTypesForActivityList } from '@portkey/constants/constants-ca/activity';
import { ActivityItemType } from '@portkey/types/types-ca/activity';

interface RouterParams {
  chainId?: string;
  symbol?: string;
}

const MAX_RESULT_COUNT = 10;

const ActivityListPage = () => {
  const { chainId, symbol } = useRouterParams<RouterParams>();
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const { data: activityList } = useAppCASelector(state => state.activity);
  const currentWallet = useCurrentWallet();

  const getActivityList = useCallback(async () => {
    setRefreshing(true);
    dispatch(clearState());

    const params: IActivitysApiParams = {
      maxResultCount: MAX_RESULT_COUNT,
      skipCount: 0,
      caAddresses: currentWallet.walletInfo.caAddressList,
      // managerAddresses: address,
      chainId: chainId,
      symbol: symbol,
      transactionTypes: transactionTypesForActivityList,
    };
    await dispatch(getActivityListAsync(params));
    setRefreshing(false);
  }, [chainId, currentWallet.walletInfo.caAddressList, dispatch, symbol]);

  useEffectOnce(() => {
    getActivityList();
  });

  const renderItem = useCallback(({ item }: { item: ActivityItemType }) => {
    return (
      <TransferItem
        item={item}
        onPress={() =>
          navigationService.navigate('ActivityDetail', { transactionId: item.transactionId, blockHash: item.blockHash })
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
      {!activityList?.length && !refreshing && (
        <NoData message={t('You have no transactions.')} topDistance={pTd(160)} />
      )}
      {activityList && (
        <FlatList
          refreshing={refreshing}
          data={activityList || []}
          keyExtractor={(_item: ActivityItemType, index: number) => `${index}`}
          renderItem={renderItem}
          onRefresh={getActivityList}
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
