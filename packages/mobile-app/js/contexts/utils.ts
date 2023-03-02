import { AElfInterface } from '@portkey-wallet/types/aelf';
import { getAelfInstance } from '@portkey-wallet/utils/aelf';
import { ContractBasic } from 'utils/contract';

export function basicActions<T extends string>(type: T, payload?: any) {
  return {
    type,
    payload,
  };
}
export type BasicActions<T = string> = {
  dispatch: (actions: { type: T; payload: any }) => void;
};

export async function getELFContract({
  contractAddress,
  aelfInstance,
  account,
  rpcUrl,
}: {
  rpcUrl?: string;
  contractAddress: string;
  aelfInstance?: AElfInterface;
  account: { address: string };
}) {
  let instance = aelfInstance;
  if (rpcUrl) instance = getAelfInstance(rpcUrl);
  if (!instance) return;
  const aelfContract = await instance.chain.contractAt(contractAddress, account);
  return new ContractBasic({
    aelfContract,
    contractAddress,
    aelfInstance: instance,
    rpcUrl: instance.currentProvider.host,
  });
}
