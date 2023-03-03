import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import useInterval from '@portkey/hooks/useInterval';
import { setCAInfo } from '@portkey/store/store-ca/wallet/actions';
import { ChainItemType } from '@portkey/store/store-ca/wallet/type';
import { ChainId, ChainType } from '@portkey/types';
import { isAddress } from '@portkey/utils';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useGetHolderInfo } from './guardian';
import { usePin } from './store';
export const useCaInfoOnChain = () => {
  const { walletInfo, chainList } = useCurrentWallet();
  console.log(walletInfo, '======walletInfo');

  const currentNetwork = useCurrentNetworkInfo();
  const dispatch = useAppDispatch();
  const getHolderInfo = useGetHolderInfo();
  const pin = usePin();
  const getHolderInfoByChainId = useCallback(
    async ({ chain, caHash }: { chain: ChainItemType; caHash: string; walletType: ChainType }) => {
      if (!pin) return;
      try {
        const result = await getHolderInfo({ caHash }, chain);
        if (!result.error) {
          const { caAddress } = result.data || {};
          caAddress &&
            dispatch(
              setCAInfo({
                caInfo: {
                  caAddress,
                  caHash,
                },
                pin,
                chainId: chain.chainId as ChainId,
              }),
            );
        }
      } catch (error) {
        console.log(error, 'getHolderInfoByChainId=====error');
      }
    },
    [dispatch, getHolderInfo, pin],
  );

  const check = useCallback(
    () => chainList?.every(chain => walletInfo[chain.chainId as ChainId] || !isAddress(chain.caContractAddress)),
    [chainList, walletInfo],
  );
  const fetch = useCallback(async () => {
    if (!chainList) return;
    if (!walletInfo.caHash) return;
    if (!pin) return;
    chainList
      .filter(chain => chain.chainId !== 'AELF')
      .forEach(chain => {
        if (!walletInfo[chain.chainId as ChainId]) {
          getHolderInfoByChainId({
            chain,
            walletType: currentNetwork.walletType,
            caHash: walletInfo.caHash ?? '',
          });
        }
      });
  }, [chainList, currentNetwork.walletType, getHolderInfoByChainId, pin, walletInfo]);

  const interval = useInterval(
    () => {
      if (check()) {
        interval.remove();
      } else {
        fetch();
      }
    },
    5000,
    [check],
  );
};
