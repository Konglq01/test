import { useMemo } from 'react';
import { useAppSelector } from 'store/hooks';

export const useWallet = () => useAppSelector(state => state.wallet);

export const useUser = () => useAppSelector(state => state.user);

export const useCredentials = () => useAppSelector(state => state.user.credentials);

export const useSettings = () => useAppSelector(state => state.settings);

export const useAccountByAddress = (address: string) => {
  const { accountList } = useWallet();
  return useMemo(() => accountList?.find(i => i.address === address), [accountList, address]);
};
