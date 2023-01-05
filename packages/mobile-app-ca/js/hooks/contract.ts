import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey/types';
import { useInterface } from 'contexts/useInterface';
import { setViewContract } from 'contexts/useInterface/actions';
import { getELFContract } from 'contexts/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { getDefaultWallet } from 'utils/aelfUtils';

export function useCurrentCAContract(chainId: ChainId = 'AELF') {
  const chainInfo = useCurrentChain(chainId);
  const [{ viewContracts }, dispatch] = useInterface();
  const getCAContract = useCallback(async () => {
    if (!chainInfo) return;
    const contract = await getELFContract({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo.endPoint,
      account: getDefaultWallet(),
    });
    if (!contract) return;
    dispatch(setViewContract({ [chainInfo.caContractAddress]: contract }));
  }, [chainInfo, dispatch]);
  useEffect(() => {
    getCAContract();
  }, [getCAContract]);
  return useMemo(() => {
    if (!chainInfo?.caContractAddress) return;
    return viewContracts?.[chainInfo.caContractAddress];
  }, [chainInfo?.caContractAddress, viewContracts]);
}
