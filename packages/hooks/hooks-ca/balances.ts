import { useCurrentNetwork } from '../network';
import { useMemo, useCallback, useState } from 'react';
import { Account } from '@portkey/types/types-ca/tokenBalance';
import { useAppCASelector } from '.';
import { useCurrentChain } from './chainList';
import { getElfChainStatus } from '@portkey/store/network/utils';
import useInterval from '../useInterval';
import { getELFTokenAddress } from '@portkey/contracts';
import { getELFContract } from '@portkey/utils/aelf';
import { useCurrentWalletInfo } from './wallet';
import { divDecimals, unitConverter } from '@portkey/utils/converter';

export function useAllBalances() {
  return useAppCASelector(state => state.tokenBalance.balances);
}

export function useCurrentNetworkBalances() {
  const balances = useAllBalances();
  const currentNetwork = useCurrentNetwork();
  return useMemo(() => {
    if (!currentNetwork.rpcUrl) return;
    return balances?.[currentNetwork.rpcUrl];
  }, [balances, currentNetwork.rpcUrl]);
}

export function useAccountListNativeBalances() {
  const accountList = useAppCASelector(state => state.wallet.accountList);
  const currentNetwork = useCurrentNetwork();
  const { nativeCurrency } = currentNetwork || {};
  const currentNetworkBalances = useCurrentNetworkBalances();
  return useMemo(() => {
    if (!currentNetworkBalances || !nativeCurrency) return;
    const obj: { [key: Account]: string } = {};
    accountList?.forEach(account => {
      const symbol = nativeCurrency.symbol;
      obj[account.address] = currentNetworkBalances?.[account.address]?.[symbol];
    });
    return obj;
  }, [nativeCurrency, currentNetworkBalances, accountList]);
}

// FIXME: test balance hook
export function useCurrentELFBalances(dev?: boolean) {
  const chainInfo = useCurrentChain('AELF');
  const { AELF } = useCurrentWalletInfo();
  const [balance, setBalance] = useState<string>();
  const getBalances = useCallback(async () => {
    if (!chainInfo?.endPoint || !dev) return;
    try {
      const chainStatus = await getElfChainStatus(chainInfo.endPoint);
      const contractAddress = await getELFTokenAddress(chainInfo.endPoint, chainStatus.GenesisContractAddress);
      const contract = await getELFContract(chainInfo.endPoint, contractAddress);
      const balance = await contract.GetBalance.call({
        symbol: 'ELF',
        owner: AELF?.caAddress,
      });
      setBalance(
        `caHash: ${AELF?.caHash}\n\n caAddress: ${AELF?.caAddress}\n\nbalance: ${unitConverter(
          divDecimals(balance.balance, 8),
        )}`,
      );
    } catch (error) {
      console.debug(error, '====useCurrentELFBalances');
    }
  }, [chainInfo]);
  const interval = useInterval(
    () => {
      if (!dev) interval.remove();
      getBalances();
    },
    10000,
    [getBalances],
  );
  return balance;
}
