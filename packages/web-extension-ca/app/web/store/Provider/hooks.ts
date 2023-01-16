import { opacityType } from '@portkey/types';
import { useCallback, useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setGlobalLoading } from 'store/reducers/user/slice';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useWalletInfo = () => useAppSelector((state) => state.wallet);
export const useLoginInfo = () => useAppSelector((state) => state.loginCache);
export const useContact = () => useAppSelector((state) => state.contact);

export const useTokenBalance = () => useAppSelector((state) => state.tokenBalance);
export const useUserInfo = () => useAppSelector((state) => state.userInfo);
export const useGuardiansInfo = () => useAppSelector((state) => state.guardians);
export const useTokenInfo = () => useAppSelector((state) => state.tokenManagement);
export const useCustomModal = () => useAppSelector((state) => state.modal);
export const useCommonState = () => useAppSelector((state) => state.common);
export const useLoading = () => {
  const { isLoading } = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();
  const setLoading = useCallback((v: boolean | opacityType) => dispatch(setGlobalLoading(v)), [dispatch]);
  return useMemo(() => ({ isLoading: !!isLoading, setLoading }), [isLoading, setLoading]);
};
