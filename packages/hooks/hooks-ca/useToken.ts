import { useAppCASelector, useAppCommonDispatch } from '../index';
import { addTokenInCurrentAccount, deleteTokenInCurrentAccount } from '@portkey/store/store-ca/tokenManagement/action';
import { fetchTokenListAsync } from '@portkey/store/store-ca/tokenManagement/slice';
import { TokenItemType, TokenState, AddedTokenData, TokenListShowInMarketType } from '@portkey/types/types-ca/token';
import { useMemo } from 'react';

export interface TokenFuncsType {
  addToken: (tokenItem: TokenItemType) => void;
  deleteToken: (tokenItem: TokenItemType) => void;
  fetchTokenList: (params: { pageSize: number; pageNo: number }) => void;
}

export const useToken = (): [TokenState, TokenFuncsType] => {
  const dispatch = useAppCommonDispatch();
  // const { currentAccount } = useAppCASelector(state => state.wallet);

  const tokenState = useAppCASelector(state => state.tokenManagement);

  const addToken = (tokenItem: TokenItemType) => {
    // if (!currentAccount) return;
    // dispatch(addTokenInCurrentAccount({ tokenItem, currentAccount }));
  };

  const deleteToken = (tokenItem: TokenItemType) => {
    // if (!currentAccount) return;
    // dispatch(deleteTokenInCurrentAccount({ tokenItem, currentAccount }));
  };

  const fetchTokenList = (params: { pageSize: number; pageNo: number }) => {
    dispatch(
      fetchTokenListAsync({
        ...params,
      }),
    );
  };

  const tokenStoreFuncs = {
    addToken,
    deleteToken,
    fetchTokenList,
  };

  return [tokenState, tokenStoreFuncs];
};

export const useAllAccountTokenList = (): AddedTokenData => {
  const { addedTokenData } = useAppCASelector(state => state.tokenManagement);

  return useMemo(() => addedTokenData, [addedTokenData]);
};

export const useMarketTokenListInCurrentChain = (): TokenListShowInMarketType => {
  const { tokenDataShowInMarket } = useAppCASelector(state => state.tokenManagement);

  return useMemo(() => tokenDataShowInMarket, [tokenDataShowInMarket]);
};

export const useIsFetchingTokenList = (): Boolean => {
  const { isFetchingTokenList } = useAppCASelector(state => state.tokenManagement);

  return useMemo(() => isFetchingTokenList, [isFetchingTokenList]);
};

export default useToken;
