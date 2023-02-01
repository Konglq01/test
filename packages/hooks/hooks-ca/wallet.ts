import { useAppCASelector } from '.';
import { useMemo, useCallback } from 'react';
import { WalletInfoType } from '@portkey/types/wallet';
import { CAInfo, CAInfoType, LoginType, TLoginStrType } from '@portkey/types/types-ca/wallet';
import { WalletState } from '@portkey/store/store-ca/wallet/type';
import { VerificationType } from '@portkey/types/verifier';
import { fetchCreateWalletResult } from '@portkey/api/api-did/apiUtils/wallet';
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

interface FetchCreateWalletParams {
  verificationType?: VerificationType;
  type: TLoginStrType; //0: Email，1：Phone
  loginGuardianType: string;
  managerUniqueId: string;
  baseUrl?: string;
}

type RegisterStatus = 'pass' | 'pending' | 'fail' | null;

export const useFetchWalletCAAddress = () => {
  const fetch = useCallback(
    async (
      params: FetchCreateWalletParams,
    ): Promise<{
      caAddress: string;
      caHash: string;
      message: null | string;
      status: Omit<RegisterStatus, 'pending'>;
    }> => {
      // TODO
      const res = await fetchCreateWalletResult(params);
      let statusField;
      switch (params.verificationType) {
        case VerificationType.register:
          statusField = 'register';
          break;
        case VerificationType.communityRecovery:
          statusField = 'recovery';
          break;
      }
      if (res[`${statusField}Status`] === 'pending') {
        await sleep(1000);
        return fetch(params);
      } else {
        return {
          ...res,
          status: res[`${statusField}Status`],
          message: res[`${statusField}Message`],
        };
      }
    },
    [],
  );

  return fetch;
};
