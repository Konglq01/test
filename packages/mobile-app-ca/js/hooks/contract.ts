import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey/types';
import aes from '@portkey/utils/aes';
import { useInterface } from 'contexts/useInterface';
import { setCAContract, setViewContract } from 'contexts/useInterface/actions';
import { getELFContract } from 'contexts/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { getDefaultWallet } from 'utils/aelfUtils';
import AElf from 'aelf-sdk';
import { useCredentials } from './store';

export function useCurrentViewCAContract(chainId: ChainId = 'AELF') {
  const chainInfo = useCurrentChain(chainId);
  const [{ viewContracts }, dispatch] = useInterface();
  const getCAContract = useCallback(async () => {
    if (!chainInfo) return;
    try {
      const contract = await getELFContract({
        contractAddress: chainInfo.caContractAddress,
        rpcUrl: chainInfo.endPoint,
        account: getDefaultWallet(),
      });
      if (!contract) return;
      dispatch(setViewContract({ [chainInfo.caContractAddress]: contract }));
    } catch (error) {
      console.log(error, '=====error-getCAContract');
    }
  }, [chainInfo, dispatch]);
  useEffect(() => {
    getCAContract();
  }, [getCAContract]);
  return useMemo(() => {
    if (!chainInfo?.caContractAddress) return;
    return viewContracts?.[chainInfo.caContractAddress];
  }, [chainInfo?.caContractAddress, viewContracts]);
}

export function useCurrentCAContract(chainId: ChainId = 'AELF') {
  const chainInfo = useCurrentChain(chainId);
  const { AESEncryptPrivateKey, address } = useCurrentWalletInfo();
  const [{ caContracts }, dispatch] = useInterface();
  const { pin } = useCredentials() || {};
  const key = useMemo(() => address + '_' + chainInfo?.caContractAddress, [address, chainInfo?.caContractAddress]);

  const caContract = useMemo(() => {
    return caContracts?.[chainId]?.[key];
  }, [caContracts, chainId, key]);

  const getCAContract = useCallback(async () => {
    if (!chainInfo || !pin || !AESEncryptPrivateKey || caContract) return;

    const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
    if (!privateKey) return;

    const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
    const contract = await getELFContract({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo.endPoint,
      account: wallet,
    });
    if (!contract) return;

    dispatch(setCAContract({ [key]: contract }, chainId));
  }, [AESEncryptPrivateKey, caContract, chainId, chainInfo, dispatch, key, pin]);

  useEffect(() => {
    getCAContract();
  }, [getCAContract]);

  return caContract;
}
