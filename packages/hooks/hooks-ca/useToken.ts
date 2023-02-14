import { useAppCASelector, useAppCommonDispatch } from '../index';
import { fetchTokenListAsync } from '@portkey/store/store-ca/tokenManagement/action';
import { TokenState, AddedTokenData, UserTokenItemType, UserTokenListType } from '@portkey/types/types-ca/token';
import { useMemo, useCallback } from 'react';
import { useCurrentNetworkInfo } from './network';
import { request } from '@portkey/api/api-did';

export interface TokenFuncsType {
  fetchTokenList: (params: { pageSize: number; pageNo: number }) => void;
  displayUserToken: (tokenItem: UserTokenItemType) => void;
}

export const useToken = (): [TokenState, TokenFuncsType] => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();

  const tokenState = useAppCASelector(state => state.tokenManagement);

  const fetchTokenList = useCallback((params: { pageSize: number; pageNo: number }) => {
    dispatch(
      fetchTokenListAsync({
        ...params,
      }),
    );
  }, []);

  const displayUserToken = useCallback(async (tokenItem: UserTokenItemType) => {
    await request.token.displayUserToken({
      baseURL: currentNetworkInfo.apiUrl,
      resourceUrl: `${tokenItem.id}/display`,
      params: {
        isDisplay: !tokenItem.isDisplay,
      },
    });
    setTimeout(() => {
      dispatch(fetchTokenListAsync({ pageSize: 1000, pageNo: 1 }));
    }, 1000);
  }, []);

  const tokenStoreFuncs = {
    fetchTokenList,
    displayUserToken,
  };

  return [tokenState, tokenStoreFuncs];
};

export const useAllAccountTokenList = (): AddedTokenData => {
  const { addedTokenData } = useAppCASelector(state => state.tokenManagement);

  return useMemo(() => addedTokenData, [addedTokenData]);
};

export const useMarketTokenListInCurrentChain = (): UserTokenListType => {
  const { tokenDataShowInMarket } = useAppCASelector(state => state.tokenManagement);

  return useMemo(() => tokenDataShowInMarket, [tokenDataShowInMarket]);
};

export const useIsFetchingTokenList = (): Boolean => {
  const { isFetchingTokenList } = useAppCASelector(state => state.tokenManagement);

  return useMemo(() => isFetchingTokenList, [isFetchingTokenList]);
};

export default useToken;
