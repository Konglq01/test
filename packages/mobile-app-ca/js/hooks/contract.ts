import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey/types';
import aes from '@portkey/utils/aes';
import { useInterface } from 'contexts/useInterface';
import { setCAContract, setViewContract } from 'contexts/useInterface/actions';
import { getContractBasic } from '@portkey/contracts/utils';
import { useCallback, useMemo } from 'react';
import { getDefaultWallet } from 'utils/aelfUtils';
import AElf from 'aelf-sdk';
import { usePin } from './store';
import { ContractBasic } from '@portkey/contracts/utils/ContractBasic';
import { ChainItemType } from '@portkey/store/store-ca/wallet/type';

export function useGetCurrentCAViewContract(chainId: ChainId = 'AELF') {
  const chainInfo = useCurrentChain(chainId);
  const [{ viewContracts }, dispatch] = useInterface();

  return useCallback(
    async (paramChainInfo?: ChainItemType) => {
      const _chainInfo = paramChainInfo || chainInfo;
      if (!_chainInfo) throw Error('Could not find chain information');

      const caContract = viewContracts?.[_chainInfo.caContractAddress];
      if (caContract) return caContract;

      const contract = await getContractBasic({
        contractAddress: _chainInfo.caContractAddress,
        rpcUrl: _chainInfo.endPoint,
        account: getDefaultWallet(),
      });
      dispatch(setViewContract({ [_chainInfo.caContractAddress]: contract as ContractBasic }));

      return contract as ContractBasic;
    },
    [chainInfo, dispatch, viewContracts],
  );
}

export function useGetCurrentCAContract(chainId: ChainId = 'AELF') {
  const chainInfo = useCurrentChain(chainId);
  const pin = usePin();
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

    const contract = await getContractBasic({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo.endPoint,
      account: wallet,
    });
    dispatch(setCAContract({ [key]: contract as ContractBasic }, chainId));
    return contract as ContractBasic;
  }, [AESEncryptPrivateKey, caContract, chainId, chainInfo, dispatch, key, pin]);
}
