import { useCallback } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { setGuardiansAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { contractErrorHandler } from 'utils/tryErrorHandler';

const useGuardiansList = () => {
  const dispatch = useAppDispatch();
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();

  const fetch = useCallback(
    async (paramsOption: { loginGuardianAccount?: string; caHash?: string }) => {
      try {
        if (!currentChain?.endPoint) throw 'Could not find chain information';
        const res = await getHolderInfo({
          rpcUrl: currentChain.endPoint,
          chainType: currentNetwork.walletType,
          address: currentChain.caContractAddress,
          paramsOption,
        });
        dispatch(setGuardiansAction(res.result.guardiansInfo));
      } catch (error: any) {
        throw contractErrorHandler(error);
      }
    },
    [currentChain, currentNetwork, dispatch],
  );

  return fetch;
};

export default useGuardiansList;
