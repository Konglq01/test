import React, { useCallback, useState } from 'react';
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

const mockData = {
  items: [
    {
      chainId: 'AELF',
      token: {
        id: Math.random(),
        chainId: 'AELF',
        symbol: 'ELF',
        address: 'xxxxxx',
      },
      amount: 10,
      amountUsd: 1000,
    },
    {
      chainId: 'AELF',
      token: {
        id: Math.random(),
        chainId: 'AELF',
        symbol: 'ELF',
        address: 'xxxxxx',
      },
      amount: 10,
      amountUsd: 1000,
    },
    {
      chainId: 'AELF',
      token: {
        id: Math.random(),
        chainId: 'AELF',
        symbol: 'ELF',
        address: 'xxxxxx',
      },
      amount: 10,
      amountUsd: 1000,
    },
  ],
  totalCount: 5,
};

export interface TokenSectionProps {
  getAccountBalance?: () => void;
}

export default function TokenSection({ getAccountBalance }: TokenSectionProps) {
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const {
    accountToken: { accountTokenList },
  } = useAppCASelector(state => state.assets);

  const [, setTokenList] = useState<any[]>([]);
  const [, setTokenNumber] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const { accountToken } = useAppCASelector(state => state.assets);

  const onNavigate = useCallback((tokenInfo: TokenItemShowType) => {
    navigationService.navigate('TokenDetail', { tokenInfo });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: TokenItemShowType }) => {
      return <TokenListItem symbol={item.symbol} icon={'aelf-avatar'} item={item} onPress={() => onNavigate(item)} />;
    },
    [onNavigate],
  );

  const getAccountTokenList = useCallback(() => {
    const timer: any = setTimeout(() => {
      setTokenList(mockData?.items ?? []);
      setTokenNumber(mockData?.totalCount ?? 0);
      setRefreshing(false);
      return clearTimeout(timer);
    }, 1000);
  }, []);

  useEffectOnce(() => {
    getAccountTokenList();
  });

  useEffectOnce(() => {
    () => dispatch(fetchTokenList({ pageNo: 1, pageSize: 1000, networkType: 'MAIN' }));
  });

  return (
    <View style={styles.tokenListPageWrap}>
      <FlatList
        refreshing={refreshing}
        data={accountTokenList || []}
        renderItem={renderItem}
        keyExtractor={(item: TokenItemShowType) => item?.id || ''}
        onRefresh={() => {
          setRefreshing(true);
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
