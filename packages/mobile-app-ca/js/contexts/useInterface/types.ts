import { AElfInterface } from '@portkey/types/aelf';
import { ContractBasic } from 'utils/contract';
export type State = {
  currentInterface?: AElfInterface;
  viewContracts?: { [key: string]: ContractBasic };
};
