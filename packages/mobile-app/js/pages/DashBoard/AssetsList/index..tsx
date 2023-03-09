import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';
import { getBalance } from '@portkey-wallet/utils/balance';
import { useAppDispatch } from 'store/hooks';
import { useCurrentAccountTokenList } from '@portkey-wallet/hooks/hooks-eoa/useToken';
import { View, TouchableOpacity, FlatList } from 'react-native';
import Svg from 'components/Svg';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import { updateBalance } from '@portkey-wallet/store/tokenBalance/slice';
import { clearMarketToken } from '@portkey-wallet/store/token/slice';
import { TextM } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import TokenListItem from 'components/TokenListItem';
import CommonToast from 'components/CommonToast';
import { useGetELFRateQuery } from '@portkey-wallet/store/rate/api';
import { useTokenContract } from 'contexts/useInterface/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { useLanguage } from 'i18n/hooks';
import { useAppEOASelector } from '@portkey-wallet/hooks/hooks-eoa';

let timer: any;

export interface AssetsListProps {
  initializing?: boolean;
}

export default function AssetsList({ initializing }: AssetsListProps) {
  const { data: rate, refetch } = useGetELFRateQuery({});
  const { t } = useLanguage();
  const tokenContract = useTokenContract();
  const dispatch = useAppDispatch();

  const localTokenList = useCurrentAccountTokenList();
  const { currentChain } = useAppEOASelector(state => state.chain);
  const { currentAccount } = useAppEOASelector(state => state.wallet);
  const [tokenListShow, setTokenListShow] = useState<TokenItemShowType[]>(localTokenList);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTokenListShow(localTokenList);
    upDateTokenBalance();
    timer = setInterval(() => {
      upDateTokenBalance();
    }, 1000 * 60 * 5);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, currentChain, dispatch, localTokenList]);

  useEffect(() => {
    dispatch(clearMarketToken({}));
  }, [currentChain, currentAccount, dispatch]);

  const upDateTokenBalance = useCallback(async () => {
    try {
      if (!localTokenList || !localTokenList?.length) return;
      if (!currentAccount?.address) return;
      if (!tokenContract) return CommonToast.fail('contract error');

      console.log('11111', tokenContract);

      const data = {
        tokens: localTokenList,
        tokenAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
        rpcUrl: currentChain.rpcUrl,
        // 'https://explorer-test.aelf.io/chain',
        // rpcUrl: ' https://explorer.aelf.io/chain',
        currentAccount: currentAccount,
        currentChain,
        tokenContract,
      };

      const res = await getBalance(data);

      console.log('getBalanceRes', data, res);

      const listShow = localTokenList.map((ele, index) => {
        return {
          ...ele,
          symbol: ele.symbol,
          balance: res[index],
        };
      });

      console.log(listShow, 'listShow===');

      dispatch(
        updateBalance({
          rpcUrl: currentChain.rpcUrl,
          account: currentAccount.address,
          balances: listShow,
        }),
      );

      setRefreshing(false);

      setTokenListShow(listShow);
    } catch (error) {
      CommonToast.fail(t('Please Try Again Later'));
      setRefreshing(false);
      console.log('error!!!', error);
    }
  }, [currentAccount, currentChain, dispatch, localTokenList, t, tokenContract]);

  useFocusEffect(
    useCallback(() => {
      upDateTokenBalance();
    }, [upDateTokenBalance]),
  );

  const onNavigate = useCallback((tokenInfo: TokenItemShowType) => {
    navigationService.navigate('TokenDetail', { tokenInfo });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: TokenItemShowType }) => {
      return (
        <TokenListItem
          symbol={item.symbol}
          icon={'aelf-avatar'}
          item={item}
          onPress={() => onNavigate(item)}
          rate={rate as { USDT: number }}
        />
      );
    },
    [onNavigate, rate],
  );

  return (
    <View style={styles.tokenListPageWrap}>
      <FlatList
        refreshing={refreshing}
        data={tokenListShow || []}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.symbol || ''}
        onRefresh={() => {
          setRefreshing(true);
          if (timer) clearInterval(timer);
          upDateTokenBalance();
          timer = setInterval(() => {
            upDateTokenBalance();
          }, 1000 * 60 * 5);
          refetch();
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
