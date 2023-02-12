import { ChainId } from '@portkey/types';
import { AElfChainMethods } from '@portkey/types/aelf';
import { basicActions } from 'contexts/utils';
import { ContractBasic } from '@portkey/contracts/utils/ContractBasic';
import { State } from './types';

export enum InterfaceActions {
  setCurrentInterface = 'setCurrentInterface',
  setViewContracts = 'setViewContracts',
  setViewContract = 'setViewContract',
  setCAContract = 'setCAContract',
  destroy = 'DESTROY',
}

export const basicInterfaceActions = {
  setCurrentInterface: (currentInterface: AElfChainMethods) =>
    basicActions(InterfaceActions.setCurrentInterface, { currentInterface }),
  setViewContracts: (viewContracts: State['viewContracts']) =>
    basicActions(InterfaceActions.setViewContracts, { viewContracts }),
  setViewContract: (viewContract: State['viewContracts']) =>
    basicActions(InterfaceActions.setViewContract, { viewContract }),
  setCAContract: (caContract: { [key: string]: ContractBasic }, chainId: ChainId) =>
    basicActions(InterfaceActions.setCAContract, { caContract, chainId }),
  interfaceDestroy: () => basicActions(InterfaceActions.destroy),
};

export const { interfaceDestroy, setCurrentInterface, setViewContracts, setViewContract, setCAContract } =
  basicInterfaceActions;
