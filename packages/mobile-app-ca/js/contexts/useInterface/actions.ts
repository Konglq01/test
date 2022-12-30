import { AElfChainMethods } from '@portkey/types/aelf';
import { basicActions } from 'contexts/utils';
import { State } from './types';

export enum InterfaceActions {
  setCurrentInterface = 'setCurrentInterface',
  setViewContracts = 'setViewContracts',
  setViewContract = 'setViewContract',
  destroy = 'DESTROY',
}

export const basicInterfaceActions = {
  setCurrentInterface: (currentInterface: AElfChainMethods) =>
    basicActions(InterfaceActions.setCurrentInterface, { currentInterface }),
  setViewContracts: (viewContracts: State['viewContracts']) =>
    basicActions(InterfaceActions.setViewContracts, { viewContracts }),
  setViewContract: (viewContract: State['viewContracts']) =>
    basicActions(InterfaceActions.setViewContract, { viewContract }),
  interfaceDestroy: () => basicActions(InterfaceActions.destroy),
};

export const { interfaceDestroy, setCurrentInterface, setViewContracts, setViewContract } = basicInterfaceActions;
