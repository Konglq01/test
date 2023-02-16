import { useAppCASelector, useAppCommonDispatch } from '../index';
import { fetchAllTokenListAsync } from '@portkey/store/store-ca/tokenManagement/action';
import { TokenState, TokenItemShowType } from '@portkey/types/types-ca/token';
import { useMemo, useCallback } from 'react';
import { useCurrentNetworkInfo } from './network';
import { request } from '@portkey/api/api-did';

export interface TokenFuncsType {
  fetchTokenList: (params: { keyword: string }) => void;
  displayUserToken: (tokenItem: TokenItemShowType) => Promise<void>;
}

export const useToken = (): [TokenState, TokenFuncsType] => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();

  const tokenState = useAppCASelector(state => state.tokenManagement);

  const fetchTokenList = useCallback((params: { keyword: string }) => {
    dispatch(
      fetchAllTokenListAsync({
        ...params,
      }),
    );
  }, []);

  const displayUserToken = useCallback(async (tokenItem: TokenItemShowType) => {
    await request.token.displayUserToken({
      baseURL: currentNetworkInfo.apiUrl,
      resourceUrl: `${tokenItem.id}/display`,
      params: {
        isDisplay: !tokenItem.isAdded,
      },
    });
    setTimeout(() => {
      dispatch(fetchAllTokenListAsync({ keyword: '' }));
    }, 1000);
  }, []);

  const tokenStoreFuncs = {
    fetchTokenList,
    displayUserToken,
  };

  return [tokenState, tokenStoreFuncs];
};

// export const useAllAccountTokenList = (): AddedTokenData => {
//   const { addedTokenData } = useAppCASelector(state => state.tokenManagement);

//   return useMemo(() => addedTokenData, [addedTokenData]);
// };

export const useMarketTokenListInCurrentChain = (): TokenItemShowType[] => {
  const { tokenDataShowInMarket } = useAppCASelector(state => state.tokenManagement);

  return useMemo(() => tokenDataShowInMarket, [tokenDataShowInMarket]);
};

export const useIsFetchingTokenList = (): Boolean => {
  const { isFetching } = useAppCASelector(state => state.tokenManagement);

  return useMemo(() => isFetching, [isFetching]);
};

export default useToken;
