import { useAppCASelector } from '.';
import { useMemo } from 'react';
import { WalletInfoType } from '@portkey/types/wallet';
import { CAInfoType } from '@portkey/types/types-ca/wallet';
import { WalletState } from '@portkey/store/store-ca/wallet/type';

export interface CurrentWalletType extends WalletInfoType, CAInfoType {}

function getCurrentWalletInfo(
  walletInfo: WalletState['walletInfo'],
  currentNetwork: WalletState['currentNetwork'],
): CurrentWalletType {
  const tmpWalletInfo: any = Object.assign({}, walletInfo, walletInfo?.caInfo?.[currentNetwork]);
  if (tmpWalletInfo.caInfo) delete tmpWalletInfo.caInfo;
  return tmpWalletInfo;
}

export const useWallet = () => useAppCASelector(state => state.wallet);

export const useCurrentWalletInfo = () => {
  const { currentNetwork, walletInfo } = useWallet();
  return useMemo(() => getCurrentWalletInfo(walletInfo, currentNetwork), [walletInfo, currentNetwork]);
};

export const useCurrentWallet = () => {
  const wallet = useWallet();
  return useMemo(() => {
    const { walletInfo, currentNetwork } = wallet;
    return { ...wallet, walletInfo: getCurrentWalletInfo(walletInfo, currentNetwork) };
  }, [wallet]);
};
