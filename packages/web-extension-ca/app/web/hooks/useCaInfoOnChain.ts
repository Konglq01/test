import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import useInterval from '@portkey/hooks/useInterval';
import { setCAInfo } from '@portkey/store/store-ca/wallet/actions';
import { ChainItemType } from '@portkey/store/store-ca/wallet/type';
import { ChainId, ChainType } from '@portkey/types';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
// TODO get

export const useCaInfoOnChain = () => {
  const { walletInfo, chainList } = useCurrentWallet();
  const currentNetwork = useCurrentNetworkInfo();
  const dispatch = useAppDispatch();

  const getHolderInfoByChainId = useCallback(
    async ({
      chain,
      caHash,
      walletType,
      pin,
    }: {
      pin: string;
      chain: ChainItemType;
      caHash: string;
      walletType: ChainType;
    }) => {
      const result = await getHolderInfo({
        rpcUrl: chain.endPoint,
        chainType: walletType,
        address: chain.caContractAddress,
        paramsOption: {
          caHash,
        },
      });
      if (result.code === 1) {
        const { caAddress, caHash } = result.result;
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
    },
    [dispatch],
  );

  const fetch = useCallback(async () => {
    if (!chainList) return;
    if (!walletInfo.caHash) return;
    const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
    const pin = getSeedResult.data.privateKey;
    if (!pin) return;
    chainList
      .filter((chain) => chain.chainId !== 'AELF')
      .forEach((chain) => {
        if (!walletInfo[chain.chainId as ChainId]) {
          getHolderInfoByChainId({
            chain,
            walletType: currentNetwork.walletType,
            caHash: walletInfo.caHash ?? '',
            pin,
          });
        }
      });
  }, [chainList, currentNetwork.walletType, getHolderInfoByChainId, walletInfo]);

  useInterval(
    () => {
      fetch();
    },
    5000,
    [fetch],
  );
};
