import { useCallback, useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setGlobalLoading } from 'store/reducers/user/slice';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useWalletInfo = () => useAppSelector((state) => state.wallet);
export const useTokenBalance = () => useAppSelector((state) => state.tokenBalance);
export const useNetwork = () => useAppSelector((state) => state.chain);
export const useUserInfo = () => useAppSelector((state) => state.userInfo);
export const useTokenInfo = () => useAppSelector((state) => state.token);
export const useCustomModal = () => useAppSelector((state) => state.modal);
export const useCommonState = () => useAppSelector((state) => state.common);
export const useLoading = (): [boolean | undefined, (v: boolean) => void] => {
  const { isLoading } = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();
  const setLoading = useCallback((v: boolean) => dispatch(setGlobalLoading(v)), [dispatch]);
  return [isLoading, setLoading];
};
export const useTradeInfo = () => {
  const state = useAppSelector((state) => state.trade);
  const { currentChain } = useNetwork();
  return useMemo(
    () => ({
      ...state,
      currentRecentContact: state.recentContact?.[currentChain.rpcUrl],
    }),
    [state, currentChain],
  );
};

export const useAddressBook = () => {
  const addressBookState = useAppSelector((state) => state.addressBook);
  const { currentChain } = useNetwork();
  return useMemo(
    () => ({
      ...addressBookState,
      currentChain,
      currentAddressBook: addressBookState.addressBook[`${currentChain.rpcUrl}&${currentChain.networkName}`],
    }),
    [addressBookState, currentChain],
  );
};
