import { useAppCASelector } from '.';
import { useMemo, useCallback } from 'react';
import { WalletInfoType } from '@portkey/types/wallet';
import { CAInfo, CAInfoType, LoginType, RegisterStatus, TLoginStrType } from '@portkey/types/types-ca/wallet';
import { WalletState } from '@portkey/store/store-ca/wallet/type';
import { VerificationType } from '@portkey/types/verifier';
import { fetchCreateWalletResult, requestCreateWallet } from '@portkey/api/api-did/utils/wallet';
import { sleep } from '@portkey/utils';

export interface CurrentWalletType extends WalletInfoType, CAInfoType {
  caHash?: string;
}

function getCurrentWalletInfo(
  walletInfo: WalletState['walletInfo'],
  currentNetwork: WalletState['currentNetwork'],
): CurrentWalletType {
  const currentCAInfo = walletInfo?.caInfo?.[currentNetwork];
  const tmpWalletInfo: any = Object.assign({}, walletInfo, currentCAInfo, {
    caHash: currentCAInfo?.AELF?.caHash,
  });
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
    const { walletInfo, currentNetwork, chainInfo } = wallet;
    return {
      ...wallet,
      walletInfo: getCurrentWalletInfo(walletInfo, currentNetwork),
      chainList: chainInfo?.[currentNetwork],
    };
  }, [wallet]);
};
