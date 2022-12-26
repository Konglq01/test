import { AElfChainMethods } from '@portkey/types/aelf';
import { basicActions } from 'contexts/utils';
import { State } from './types';

export enum interfaceActions {
  setCurrentInterface = 'setCurrentInterface',
  setViewContracts = 'viewContractInterface',
  destroy = 'DESTROY',
}

export const basicInterfaceActions = {
  setCurrentInterface: (currentInterface: AElfChainMethods) =>
    basicActions(interfaceActions.setCurrentInterface, { currentInterface }),
  setViewContracts: (viewContracts: State['viewContracts']) =>
    basicActions(interfaceActions.setViewContracts, { viewContracts }),
  interfaceDestroy: () => basicActions(interfaceActions.destroy),
};

export const { interfaceDestroy, setCurrentInterface, setViewContracts } = basicInterfaceActions;
