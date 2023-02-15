import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';
import { useAppCASelector, useAppCommonDispatch } from '@portkey/hooks/index';
import { View, TouchableOpacity, FlatList } from 'react-native';
import Svg from 'components/Svg';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { TextM } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import TokenListItem from 'components/TokenListItem';
import { useLanguage } from 'i18n/hooks';
import useEffectOnce from 'hooks/useEffectOnce';
import { fetchTokenList } from '@portkey/store/store-ca/assets/api';
import { request } from '@portkey/api/api-did';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { fetchTokenListAsync } from '@portkey/store/store-ca/assets/slice';

export interface TokenSectionProps {
  getAccountBalance?: () => void;
}

export default function TokenSection({ getAccountBalance }: TokenSectionProps) {
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const {
    accountToken: { accountTokenList, isFetching, SkipCount, MaxResultCount, totalRecordCount },
  } = useAppCASelector(state => state.assets);

  console.log('accountTokenListaccountTokenListaccountTokenList', accountTokenList);

  const currentNetworkInfo = useCurrentNetworkInfo();

  const {
    walletInfo: { caAddressList },
  } = useCurrentWallet();

  const [, setTokenList] = useState<any[]>([]);
  const [, setTokenNumber] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const { accountToken } = useAppCASelector(state => state.assets);

  const onNavigate = useCallback((tokenInfo: TokenItemShowType) => {
    navigationService.navigate('TokenDetail', { tokenInfo });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: TokenItemShowType }) => {
      return <TokenListItem key={item.symbol} item={item} onPress={() => onNavigate(item)} />;
    },
    [onNavigate],
  );

  const getAccountTokenList = useCallback(() => {
    const timer: any = setTimeout(() => {
      dispatch(fetchTokenListAsync({ CaAddresses: caAddressList || [] }));

      return clearTimeout(timer);
    }, 1000);
  }, [caAddressList, dispatch]);

  useEffectOnce(() => {
    getAccountTokenList();
  });

  useEffectOnce(() => {
    () => dispatch(fetchTokenList({ CaAddresses: caAddressList || [] }));
  });

  useEffect(() => {
    console.log('caAddressList', caAddressList);

    request.assets
      .fetchAccountTokenList({
        baseURL: currentNetworkInfo.apiUrl,
        params: {
          CaAddresses: caAddressList,
          SkipCount: 0,
          MaxResultCount: 10,
        },
      })
      .then(res => console.log('!!!!', res));
  }, []);

  // const TTT = () => {
  //   const {
  //     walletInfo: { caAddressList },
  //   } = currentWallet;
  //   console.log('caAddressList', caAddressList);

  //   request.assets
  //     .fetchAccountTokenList({
  //       baseURL: currentNetworkInfo.apiUrl,
  //       params: {
  //         CaAddresses: caAddressList,
  //         SkipCount: 1,
  //         MaxResultCount: 10,
  //       },
  //     })
  //     .then(res => console.log('!!!!', res));

  //   request.assets
  //     .fetchAccountTokenList({
  //       baseURL: currentNetworkInfo.apiUrl,
  //       params: {
  //         CaAddresses: caAddressList,
  //         SkipCount: 1,
  //         MaxResultCount: 10,
  //       },
  //     })
  //     .then(res => console.log('!!!!', res));
  // };

  return (
    <View style={styles.tokenListPageWrap}>
      <FlatList
        refreshing={isFetching}
        data={accountTokenList || []}
        renderItem={renderItem}
        keyExtractor={(item: TokenItemShowType) => item.symbol + item.chainId}
        onRefresh={() => {
          getAccountBalance?.();
          getAccountTokenList();
        }}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addWrap}
            onPress={() => {
              navigationService.navigate('ManageTokenList');
            }}>
            <Svg icon="add-token" size={20} />
            <TextM style={styles.addTokenText}>{t('Add Tokens')}</TextM>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tokenListPageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
  iconStyles: {},
  containerStyle: {},
  addWrap: {
    shadowColor: 'red',
    marginTop: pTd(24),
    marginBottom: pTd(24),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTokenText: {
    marginLeft: pTd(8),
    color: defaultColors.font4,
  },
});
