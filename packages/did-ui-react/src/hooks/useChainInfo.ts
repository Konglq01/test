import { request } from '@portkey/api/api-did';
import { useEffect, useState, useCallback } from 'react';
import { ChainInfoType } from '../components/SignIn/types';
import { OnErrorFunc } from '../types/error';

interface ChainInfoParams {
  baseUrl?: string;
  chainId: string;
  chainInfo?: ChainInfoType;
}

const useChainInfo = ({ baseUrl, chainInfo, chainId = 'AELF' }: ChainInfoParams, onError?: OnErrorFunc) => {
  const [_chainInfo, setChainInfo] = useState<ChainInfoType | undefined>(chainInfo);
  const getChainList = useCallback(
    async ({ baseUrl }: { baseUrl?: string }) => {
      try {
        if (chainInfo) return;
        const response = await request.es.getChainsInfo({ baseURL: baseUrl });
        if (response && response?.items?.length) {
          const chain = response.items.find((item: any) => item.chainId === chainId);
          setChainInfo({
            ...chain,
            contractAddress: chain.caContractAddress,
          });
        }
      } catch (error: any) {
        if (error?.type) return onError?.({ errorFields: 'getChainList', error: error.type });
        if (error?.error?.message) return onError?.({ errorFields: 'getChainList', error: error.error.message });
        return onError?.({ errorFields: 'getChainList', error });
      }
    },
    [chainId, chainInfo, onError],
  );

  useEffect(() => {
    getChainList({ baseUrl });
  }, [baseUrl, getChainList]);

  console.log(chainInfo, '_chainInfo===22213');

  return _chainInfo;
};

export default useChainInfo;
