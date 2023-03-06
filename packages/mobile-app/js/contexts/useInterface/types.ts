import { AElfInterface } from '@portkey-wallet/types/aelf';
import { BasicContracts } from '@portkey-wallet/types/chain';
import { ContractBasic } from 'utils/contract';
export type State = {
  currentInterface?: AElfInterface;
  viewContracts?: { [key in keyof BasicContracts]: ContractBasic };
};
