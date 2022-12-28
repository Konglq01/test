import { useAppCASelector } from '.';
import { useMemo, useCallback } from 'react';
import { WalletInfoType } from '@portkey/types/wallet';
import { CAInfoType, LoginType } from '@portkey/types/types-ca/wallet';
import { WalletState } from '@portkey/store/store-ca/wallet/type';
import { VerificationType } from '@portkey/types/verifier';
import { fetchCreateWalletResult } from '@portkey/api/apiUtils/wallet';
import { sleep } from '@portkey/utils';

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

interface FetchCreateWalletParams {
  verificationType?: VerificationType;
  type: LoginType; //0: Email，1：Phone
  loginGuardianType: string;
  managerUniqueId: string;
  baseUrl: string;
}

type RegisterStatus = 'pass' | 'pending' | 'fail' | null;

export const useFetchWalletCAAddress = () => {
  const fetch = useCallback(
    async (
      params: FetchCreateWalletParams,
    ): Promise<{
      ca_address: string;
      ca_hash: string;
      register_message: null | string;
      register_status: Omit<RegisterStatus, 'pending'>;
    }> => {
      // TODO
      const res = await fetchCreateWalletResult(params);

      if (res.register_status === 'pending') {
        await sleep(1000);
        return fetch(params);
      }
      return res;
    },
    [],
  );

  return fetch;
};
