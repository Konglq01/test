import React, { useState, useCallback, memo, useEffect } from 'react';
import NoData from 'components/NoData';
import { StyleSheet, View, FlatList } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import useEffectOnce from 'hooks/useEffectOnce';
import { pTd } from 'utils/unit';
import NFTCollectionItem from './NFTCollectionItem';
import { useCaAddresses } from '@portkey/hooks/hooks-ca/wallet';
import { fetchNFTAsync, fetchNFTCollectionsAsync, clearNftItem } from '@portkey/store/store-ca/assets/slice';
import { useAppCommonDispatch } from '@portkey/hooks';
import { useAppCASelector } from '@portkey/hooks';
import { NFTCollectionItemShowType } from '@portkey/types/types-ca/assets';
import { useWallet } from 'hooks/store';
import Touchable from 'components/Touchable';
import { REFRESH_TIME } from '@portkey/constants/constants-ca/assets';
import { ChainId } from '@portkey/types';
import { useRoute } from '@react-navigation/native';

export interface OpenCollectionObjType {
  [key: string]: {
    // key = symbol+chainId
    pageNum: number;
    pageSize: number;
    itemCount: number;
  };
}

type NFTSectionPropsType = {
  getAccountBalance?: () => void;
};

type NFTCollectionProps = NFTCollectionItemShowType & {
  isCollapsed: boolean;
  openCollectionObj: OpenCollectionObjType;
  setOpenCollectionObj: any;
  openItem: (symbol: string, chainId: ChainId, itemCount: number) => void;
  closeItem: (symbol: string, chainId: ChainId) => void;
  loadMoreItem: (symbol: string, chainId: ChainId, pageNum: number) => void;
};

function areEqual(prevProps: NFTCollectionProps, nextProps: NFTCollectionProps) {
  return false;
  // return nextProps.isCollapsed === prevProps.isCollapsed && nextProps.children.length === prevProps.children.length;
}

const NFTCollection: React.FC<NFTCollectionProps> = memo((props: NFTCollectionProps) => {
  const { symbol, isCollapsed } = props;
  // const dispatch = useAppCommonDispatch();

  return <NFTCollectionItem key={symbol} collapsed={isCollapsed} {...props} />;
}, areEqual);

NFTCollection.displayName = 'NFTCollection';

export default function NFTSection({ getAccountBalance }: NFTSectionPropsType) {
  const { t } = useLanguage();
  const caAddresses = useCaAddresses();
  const { currentNetwork, walletInfo } = useWallet();
  const dispatch = useAppCommonDispatch();

  const {
    accountNFT: { accountNFTList, totalRecordCount },
  } = useAppCASelector(state => state.assets);

  const [reFreshing] = useState(false);
  const [openCollectionObj, setOpenCollectionObj] = useState<OpenCollectionObjType>({});
  const { clearType } = useRoute<any>();
  console.log('clearTypeclearType', clearType);

  // const fetchNFTList = useCallback(() => {
  //   const timer: any = setTimeout(() => {
  //     dispatch(fetchNFTCollectionsAsync({ caAddresses }));
  //     // setRefreshing(false);
  //     return clearTimeout(timer);
  //   }, REFRESH_TIME);
  // }, [caAddresses, dispatch]);

  const fetchNFTList = useCallback(() => {
    if (caAddresses.length === 0) return;
    dispatch(fetchNFTCollectionsAsync({ caAddresses }));
  }, [caAddresses, dispatch]);

  useEffect(() => {
    fetchNFTList();
  }, [fetchNFTList]);

  useEffect(() => {
    if (clearType) setOpenCollectionObj({});
  }, [clearType]);

  const closeItem = useCallback(
    (symbol: string, chainId: string) => {
      const key = `${symbol}${chainId}`;
      const newObj = { ...openCollectionObj };
      delete newObj[key];

      setOpenCollectionObj(newObj);
    },
    [openCollectionObj],
  );

  const openItem = useCallback(
    (symbol: string, chainId: ChainId, itemCount: number) => {
      const currentCaAddress = walletInfo?.caInfo?.[currentNetwork]?.[chainId]?.caAddress;

      const key = `${symbol}${chainId}`;
      const newObj = {
        ...openCollectionObj,
        [key]: {
          pageNum: 0,
          pageSize: 9,
          itemCount,
        },
      };

      dispatch(
        fetchNFTAsync({
          symbol,
          chainId,
          caAddresses: [currentCaAddress || ''],
          pageNum: 0,
        }),
      );

      setOpenCollectionObj(newObj);
    },
    [currentNetwork, dispatch, openCollectionObj, walletInfo?.caInfo],
  );

  const loadMoreItem = useCallback(
    (symbol: string, chainId: ChainId, pageNum = 0) => {
      const currentCaAddress = walletInfo?.caInfo?.[currentNetwork]?.[chainId]?.caAddress;

      dispatch(
        fetchNFTAsync({
          symbol,
          chainId,
          caAddresses: [currentCaAddress || ''],
          pageNum: pageNum + 1,
        }),
      );
    },
    [currentNetwork, dispatch, walletInfo?.caInfo],
  );

  return (
    <View style={styles.wrap}>
      <FlatList
        refreshing={reFreshing}
        data={totalRecordCount === 0 ? [] : accountNFTList || []}
        ListEmptyComponent={() => (
          <Touchable>
            <NoData type="top" message={t('No NFTs yet ')} />
          </Touchable>
        )}
        renderItem={({ item }: { item: NFTCollectionItemShowType }) => (
          <NFTCollection
            key={item.symbol}
            isCollapsed={!openCollectionObj?.[`${item.symbol}${item.chainId}`]}
            openCollectionObj={openCollectionObj}
            setOpenCollectionObj={setOpenCollectionObj}
            openItem={openItem}
            closeItem={closeItem}
            loadMoreItem={loadMoreItem}
            {...item}
          />
        )}
        keyExtractor={(item: NFTCollectionItemShowType) => item?.symbol + item.chainId}
        onRefresh={() => {
          setOpenCollectionObj({});
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
