import { getELFContract } from '@portkey/utils/aelf';
import AElf from 'aelf-sdk';

export const getELFChainBalance = async (tokenContract: any, symbol: string, owner: string) => {
  let balance = await tokenContract.GetBalance.call({
    symbol,
    owner,
  });

  return balance?.balance ?? balance?.amount ?? 0;
};

export const getELFContractAddress = async (rpcUrl: string, GenesisContractAddress: string, name: string) => {
  const zeroContract = await getELFContract(rpcUrl, GenesisContractAddress);
  return await zeroContract.GetContractAddressByName.call(AElf.utils.sha256(name));
};

export const getELFTokenAddress = async (rpcUrl: string, GenesisContractAddress: string): Promise<string> => {
  return getELFContractAddress(rpcUrl, GenesisContractAddress, 'AElf.ContractNames.Token');
};
