import React, { useState, useCallback, useEffect, memo } from 'react';
import NoData from 'components/NoData';
import { StyleSheet, View, FlatList } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import useEffectOnce from 'hooks/useEffectOnce';
import { pTd } from 'utils/unit';
import NFTCollectionItem from './NFTCollectionItem';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCaAddresses, useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { fetchNFTAsync, fetchNFTCollectionsAsync } from '@portkey/store/store-ca/assets/slice';
import { useAppCommonDispatch } from '@portkey/hooks';
import { useAppCASelector } from '@portkey/hooks';
import { NFTCollectionItemShowType } from '@portkey/types/types-ca/assets';

type NFTSectionPropsType = {
  getAccountBalance?: () => void;
};

type NFTCollectionProps = NFTCollectionItemShowType & {
  isCollapsed: boolean;
  currentNFT: string;
  setCurrentNFT: any;
  loadMoreItem: () => void;
};

function areEqual(prevProps: NFTCollectionProps, nextProps: NFTCollectionProps) {
  return false;
  // eslint-disable-next-line no-self-compare
  return nextProps.isCollapsed === prevProps.isCollapsed;
}

const NFTCollection: React.FC<NFTCollectionProps> = memo((props: NFTCollectionProps) => {
  const { symbol, isCollapsed } = props;
  const dispatch = useAppCommonDispatch();

  return <NFTCollectionItem key={symbol} collapsed={isCollapsed} {...props} />;
}, areEqual);

NFTCollection.displayName = 'NFTCollection';

export default function NFTSection({ getAccountBalance }: NFTSectionPropsType) {
  const { t } = useLanguage();

  const [currentNFT, setCurrentNFT] = useState('');
  const currentNetworkInfo = useCurrentNetworkInfo();

  const caAddresses = useCaAddresses();

  const dispatch = useAppCommonDispatch();
  const {
    accountNFT: { accountNFTList, skipCount, totalRecordCount },
  } = useAppCASelector(state => state.assets);

  console.log('[[[[[[[accountNFTList', accountNFTList);

  const [refreshing, setRefreshing] = useState(false);
  const [NFTList, setNFTList] = useState<any[]>([]);

  const fetchNFTList = useCallback(() => {
    const timer: any = setTimeout(() => {
      dispatch(fetchNFTCollectionsAsync({ caAddresses }));
      // setNFTList(result?.items ?? []);
      // setNFTNum(result.totalCount ?? 0);
      // setRefreshing(false);
      return clearTimeout(timer);
    }, 1000);
  }, [caAddresses, dispatch]);

  useEffectOnce(() => {
    fetchNFTList();
  });

  if (totalRecordCount === 0) return <NoData type="top" message={t('No NFTs yet ')} />;

  console.log('accountNFTList<<<<<', accountNFTList);

  return (
    <View style={styles.wrap}>
      <FlatList
        refreshing={refreshing}
        data={accountNFTList || []}
        renderItem={({ item }: { item: NFTCollectionItemShowType }) => (
          <NFTCollection
            key={item.symbol}
            isCollapsed={item.symbol !== currentNFT}
            currentNFT={currentNFT}
            setCurrentNFT={setCurrentNFT}
            loadMoreItem={() => {
              console.log('item symbol', item.symbol);
              dispatch(fetchNFTAsync({ caAddresses, symbol: item.symbol }));
            }}
            {...item}
          />
        )}
        keyExtractor={(item: NFTCollectionItemShowType) => item?.symbol + item.chainId}
        onRefresh={() => {
          setRefreshing(true);
          getAccountBalance?.();
          fetchNFTList();
        }}
        onEndReached={() => {
          if (accountNFTList.length >= totalRecordCount) return;
          dispatch(fetchNFTCollectionsAsync({ caAddresses }));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
  itemWrap: {
    width: '100%',
    height: pTd(100),
  },
});
