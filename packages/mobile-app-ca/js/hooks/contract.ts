import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey/types';
import aes from '@portkey/utils/aes';
import { useInterface } from 'contexts/useInterface';
import { setCAContract, setViewContract } from 'contexts/useInterface/actions';
import { getELFContract } from 'contexts/utils';
import { useCallback, useMemo } from 'react';
import { getDefaultWallet } from 'utils/aelfUtils';
import AElf from 'aelf-sdk';
import { useCredentials } from './store';
import { ContractBasic } from 'utils/contract';

export function useGetCurrentCAViewContract(chainId: ChainId = 'AELF') {
  const chainInfo = useCurrentChain(chainId);
  const [{ viewContracts }, dispatch] = useInterface();

  const caContract = useMemo(() => {
    if (!chainInfo?.caContractAddress) return;
    return viewContracts?.[chainInfo.caContractAddress];
  }, [chainInfo?.caContractAddress, viewContracts]);

  return useCallback(async () => {
    if (caContract) return caContract;
    if (!chainInfo) throw Error('Could not find chain information');
    const contract = await getELFContract({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo.endPoint,
      account: getDefaultWallet(),
    });
    dispatch(setViewContract({ [chainInfo.caContractAddress]: contract as ContractBasic }));

    return contract as ContractBasic;
  }, [caContract, chainInfo, dispatch]);
}

export function useGetCurrentCAContract(chainId: ChainId = 'AELF') {
  const chainInfo = useCurrentChain(chainId);
  const { pin } = useCredentials() || {};
  const { AESEncryptPrivateKey, address } = useCurrentWalletInfo();
  const [{ caContracts }, dispatch] = useInterface();
  const key = useMemo(() => address + '_' + chainInfo?.caContractAddress, [address, chainInfo?.caContractAddress]);
  const caContract = useMemo(() => {
    return caContracts?.[chainId]?.[key];
  }, [caContracts, chainId, key]);

  return useCallback(async () => {
    if (caContract) return caContract;

    if (!chainInfo) throw Error('Could not find chain information');
    if (!pin || !AESEncryptPrivateKey) throw Error('Could not find wallet information');

    const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
    const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);

    const contract = await getELFContract({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo.endPoint,
      account: wallet,
    });
    dispatch(setCAContract({ [key]: contract as ContractBasic }, chainId));
    return contract as ContractBasic;
  }, [AESEncryptPrivateKey, caContract, chainId, chainInfo, dispatch, key, pin]);
}
