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
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { fetchTokenListAsync } from '@portkey/store/store-ca/assets/slice';
import { REFRESH_TIME } from '@portkey/constants/constants-ca/assets';

let timer2: string | number | NodeJS.Timer | undefined;

export interface TokenSectionProps {
  getAccountBalance?: () => void;
}

export default function TokenSection({ getAccountBalance }: TokenSectionProps) {
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const {
    accountToken: { accountTokenList },
  } = useAppCASelector(state => state.assets);

  const {
    walletInfo: { caAddressList },
  } = useCurrentWallet();

  const [isFetching] = useState(false);

  const onNavigate = useCallback((tokenItem: TokenItemShowType) => {
    navigationService.navigate('TokenDetail', { tokenInfo: tokenItem });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: TokenItemShowType }) => {
      return <TokenListItem key={item.symbol} item={item} onPress={() => onNavigate(item)} />;
    },
    [onNavigate],
  );

  const getAccountTokenList = useCallback(() => {
    if (caAddressList?.length === 0) return;

    dispatch(fetchTokenListAsync({ caAddresses: caAddressList || [] }));
  }, [caAddressList, dispatch]);

  useEffect(() => {
    getAccountTokenList();
  }, [caAddressList, getAccountTokenList]);

  useEffect(() => {
    if (timer2) clearInterval(timer2);
    timer2 = setInterval(() => {
      getAccountTokenList();
    }, REFRESH_TIME);
    return () => clearInterval(timer2);
  }, [getAccountTokenList]);

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
