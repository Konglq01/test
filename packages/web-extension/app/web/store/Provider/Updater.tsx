import { useCallback, useEffect } from 'react';
import { keepAliveOnPages } from 'utils/keepSWActive';
import getViewTokenContract from 'utils/sandboxUtil/getViewTokenContract';
import { useNetwork } from './hooks';
import useUpdateRedux from './useUpdateRedux';

export default function Updater() {
  const { currentChain } = useNetwork();
  useUpdateRedux();
  useEffect(() => {
    // keepSWActive({
    //   name: WORKER_KEEP_ALIVE_MESSAGE,
    //   onMessageListener: (message, port) => {
    //     console.log(message, port);
    //   },
    // });
    keepAliveOnPages();
  }, []);

  const getTokenContract = useCallback(async () => {
    if (!currentChain.nativeCurrency?.address) return;
    await getViewTokenContract({
      rpcUrl: currentChain.rpcUrl,
      address: currentChain.nativeCurrency?.address,
      chainType: currentChain.chainType,
    });
  }, [currentChain]);

  useEffect(() => {
    getTokenContract();
  }, [getTokenContract]);

  return null;
}
