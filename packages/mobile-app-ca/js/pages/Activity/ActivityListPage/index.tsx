import React, { useEffect, useState, useCallback } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector } from 'store/hooks';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import TransferItem from 'components/TransferList/components/TransferItem';
import { FlatList } from 'react-native-gesture-handler';
import { fetchActivitiesAsync } from '@portkey/store/store-ca/activity/slice';
import { useAppCASelector, useAppCommonDispatch } from '@portkey/hooks';
import NoData from 'components/NoData';

interface ActivityListPagePropsType {
  netWork?: string;
}

const ActivityListPage: React.FC<ActivityListPagePropsType> = (props: ActivityListPagePropsType) => {
  const { t } = useLanguage();
  console.log(props);

  const dispatch = useAppCommonDispatch();

  const { currentChain } = useAppSelector(state => state.chain);

  const activity = useAppCASelector(state => state.activity);

  const [list, setList] = useState<any[]>([]);
  const [listShow, setListShow] = useState<any[]>([]);

  useEffect(() => {
    setListShow(activity.list);
  }, [activity]);

  useEffectOnce(() => {
    //TODO fetch activity List
    dispatch(fetchActivitiesAsync({ type: 'MAIN' }));
  });

  const renderItem = useCallback(({ item }: any) => {
    return <TransferItem item={item} onPress={() => navigationService.navigate('ActivityDetail')} />;
  }, []);

  return (
    <PageContainer
      titleDom={t('Activity')}
      safeAreaColor={['blue', 'white']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {!listShow.length && <NoData message={t('You have no transactions.')} topDistance={pTd(160)} />}

      <FlatList data={listShow || []} keyExtractor={(item: any) => item?.key ?? ''} renderItem={renderItem} />
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
