import { useCurrentNetwork } from '@portkey/hooks/network';
import { request } from 'api';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { getApiBaseData } from 'utils/wallet';
import { useCredentials, useWallet } from './store';
import MockTokenList from '@portkey/store/token/data.json';
import { PUB_KEY } from 'constants/api';
import { rsaEncryptObj } from 'utils/rsaEncrypt';

const {
  data: { list: mockTokenList },
} = MockTokenList;

export const useBindTokens = (): boolean => {
  const currentNetwork = useCurrentNetwork();
  const { currentAccount } = useWallet();
  const { password } = useCredentials() || {};
  const [loading, setLoading] = useState(true);
  // const [status, setStatus] = useState<'pending' | 'fail' | 'success'>('pending');

  const baseData = useMemo(() => {
    if (!currentAccount) return '';
    return getApiBaseData({ currentAccount, currentNetwork, password: password || '' });
  }, [currentAccount, currentNetwork, password]);

  const bindTokens = useCallback(
    (shouldBindList: any[]) => {
      if (!currentAccount) return;

      const bindList = shouldBindList.map(ele => {
        const otherData = rsaEncryptObj(
          {
            // init: 1,
            symbol: ele.symbol,
            flag: '1',
            contract_address:
              ele?.contractAddress ?? ele.address ?? 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
          },
          PUB_KEY,
        )[0];

        console.log('otherData', ele, ele.symbol, ele?.address);

        const cryptoData = `${baseData}&${otherData}`;

        return request.wallet.bind({
          data: cryptoData,
          networkType: currentNetwork?.netWorkType || 'TESTNET', // todo  delete type
        });
      });

      Promise.all(bindList).then(res => {
        console.log('success!!!', res);
        setLoading(false);
      });
    },
    [baseData, currentAccount, currentNetwork?.netWorkType],
  );

  const fetchTokenList = useCallback(async () => {
    try {
      const { data } = await request.wallet.assets({
        data: baseData,
        networkType: currentNetwork?.netWorkType || 'MAIN', // todo  delete type
      });

      console.log('currentNetwork', data, currentNetwork);

      // remote tokenList
      const remoteList = data[currentNetwork.chainId];

      const shouldBindList = mockTokenList.filter(ele => {
        return !!remoteList.find((token: any) => token.symbol === ele.symbol && token.in === 0);
      });

      console.log('remoteList', remoteList);
      console.log('shouldBindList', shouldBindList);
      bindTokens(shouldBindList);
    } catch (error) {
      console.log('fetchTokenList error!!!', error);
    }
  }, [baseData, bindTokens, currentNetwork]);

  useEffect(() => {
    fetchTokenList();
  }, [fetchTokenList]);

  return loading;
};
