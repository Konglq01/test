import { AElfInterface } from '@portkey/types/aelf';
import { BasicContracts } from '@portkey/types/chain';
import { ContractBasic } from 'utils/contract';
export type State = {
  currentInterface?: AElfInterface;
  viewContracts?: { [key in keyof BasicContracts]: ContractBasic };
};
