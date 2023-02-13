import React, { useState, useCallback } from 'react';
import NoData from 'components/NoData';
import { StyleSheet, View, FlatList } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import useEffectOnce from 'hooks/useEffectOnce';
import { pTd } from 'utils/unit';
import NFTItem from './NFTItem';

const mockData = {
  // items: [
  //   {
  //     chainId: 'AELF',
  //     name: 'Mini Kove',
  //     amount: '1000',
  //     nftInfo: {
  //       nftTokenId: '#1001',
  //       tokenHash: 'xxxxx',
  //       count: 50,
  //       nftProtocolInfo: Array(50)
  //         .fill('')
  //         .map(ele => ({
  //           symbol: 'Mini Kove' + Math.random(),
  //           nftType: 'Type',
  //           totalSupply: '1000',
  //           baseUri: 'baseUri',
  //         })),
  //       // [
  //       //   {
  //       //     symbol: 'Mini Kove',
  //       //     nftType: 'Type',
  //       //     totalSupply: '1000',
  //       //     baseUri: 'baseUri',
  //       //   },
  //       //   {
  //       //     symbol: 'Mini Kove1',
  //       //     nftType: 'Type',
  //       //     totalSupply: '1000',
  //       //     baseUri: 'baseUri',
  //       //   },
  //       //   {
  //       //     symbol: 'Mini Kove2',
  //       //     nftType: 'Type',
  //       //     totalSupply: '1000',
  //       //     baseUri: 'baseUri',
  //       //   },
  //       //   {
  //       //     symbol: 'Mini Kove3',
  //       //     nftType: 'Type',
  //       //     totalSupply: '1000',
  //       //     baseUri: 'baseUri',
  //       //   },
  //       // ],
  //     },
  //   },
  //   {
  //     chainId: 'tDVV',
  //     name: 'Mini Kove1',
  //     amount: '1000',
  //     nftInfo: {
  //       nftTokenId: '#1002',
  //       tokenHash: 'xxxxx',
  //       count: 100,
  //       nftProtocolInfo: [
  //         {
  //           symbol: 'Mini Kove',
  //           nftType: 'Type',
  //           totalSupply: '1000',
  //           baseUri: 'baseUri',
  //         },
  //         {
  //           symbol: 'Mini Kove1',
  //           nftType: 'Type',
  //           totalSupply: '1000',
  //           baseUri: 'baseUri',
  //         },
  //         {
  //           symbol: 'Mini Kove3',
  //           nftType: 'Type',
  //           totalSupply: '1000',
  //           baseUri: 'baseUri',
  //         },
  //         {
  //           symbol: 'Mini Kove4',
  //           nftType: 'Type',
  //           totalSupply: '1000',
  //           baseUri: 'baseUri',
  //         },
  //       ],
  //     },
  //   },
  // ],
  item: [],
  totalCount: 0,
};

type NFTSectionPropsType = {
  getAccountBalance?: () => void;
};

export default function NFTSection({ getAccountBalance }: NFTSectionPropsType) {
  const { t } = useLanguage();

  const [currentNFT, setCurrentNFT] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const [NFTList, setNFTList] = useState<any[]>([]);
  const [NFTNum, setNFTNum] = useState(0);

  const fetchNFTList = useCallback(() => {
    const timer: any = setTimeout(() => {
      const result = mockData;

      setNFTList(result?.items ?? []);
      setNFTNum(result.totalCount ?? 0);
      setRefreshing(false);
      return clearTimeout(timer);
    }, 1000);
  }, []);

  useEffectOnce(() => {
    fetchNFTList();
  });

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      return (
        <NFTItem
          key={item?.name}
          data={item}
          collapsed={item?.name !== currentNFT}
          currentNFT={currentNFT}
          setCurrentNFT={setCurrentNFT}
          loadMoreItem={(id: string) => {
            console.log(`current series id ${id} `);
          }}
        />
      );
    },
    [currentNFT],
  );

  if (NFTNum === 0) return <NoData type="top" message={t('No NFTs yet ')} />;

  return (
    <View style={styles.wrap}>
      {/* <FlatList
        refreshing={refreshing}
        data={NFTList || []}
        renderItem={renderItem}
        keyExtractor={(item: any) => item?.nftInfo?.nftTokenId || ''}
        onRefresh={() => {
          setRefreshing(true);
          getAccountBalance?.();
          fetchNFTList();
        }}
        onEndReached={() => {
          console.log('load more series');
        }}
      /> */}
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
