import { useWallet } from 'hooks/store';
import { useMemo } from 'react';
import { useInterface } from '.';
import useInterval from '@portkey/hooks/useInterval';
import { useAppDispatch } from 'store/hooks';
import { updateAccountListBalance } from '@portkey/store/tokenBalance/slice';

export function useViewContracts() {
  const [{ viewContracts }] = useInterface();
  return useMemo(() => viewContracts, [viewContracts]);
}

export function useTokenContract() {
  return useViewContracts()?.tokenContract;
}
export function useAccountListBalanceTimer() {
  const tokenContract = useTokenContract();
  const { accountList } = useWallet();
  const dispatch = useAppDispatch();
  useInterval(
    async () => {
      if (!tokenContract || !accountList) return;
      const balances = await Promise.all(
        accountList.map(account =>
          tokenContract.callViewMethod('GetBalance', {
            symbol: 'ELF',
            owner: account.address,
          }),
        ),
      );
      const newAccountList = accountList
        .map((i, key) => {
          const balanceItem = balances[key];
          if (!balanceItem.error)
            return {
              account: i.address,
              symbol: 'ELF',
              balance: balanceItem.balance,
            };
        })
        .filter(i => !!i);
      if (newAccountList.length)
        dispatch(
          updateAccountListBalance({
            rpcUrl: tokenContract.rpcUrl,
            accountList: newAccountList as any,
          }),
        );
    },
    20000,
    [tokenContract, accountList?.map(i => i.address)],
  );
}
