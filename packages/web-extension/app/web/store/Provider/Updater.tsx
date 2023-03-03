import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { keepAliveOnPages } from 'utils/keepSWActive';
import getViewTokenContract from 'utils/sandboxUtil/getViewTokenContract';
import { useNetwork } from './hooks';
import useUpdateRedux from './useUpdateRedux';

export default function Updater() {
  const { currentChain } = useNetwork();
  useUpdateRedux();

  const navigate = useNavigate();
  useEffect(() => {
    keepAliveOnPages({ onError: () => navigate('/unlock') });
  }, [navigate]);

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
