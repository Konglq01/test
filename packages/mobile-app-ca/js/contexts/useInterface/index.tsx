import { useCurrentNetwork } from '@portkey/hooks/network';
import { getAelfInstance } from '@portkey/utils/aelf';
import usePrevious from 'hooks/usePrevious';
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { InterfaceActions, setCurrentInterface } from './actions';
import { State } from './types';

const INITIAL_STATE = {};
const InterfaceContext = createContext<any>(INITIAL_STATE);

export function useInterface(): [State, any] {
  return useContext(InterfaceContext);
}

//reducer
function reducer(state: State, { type, payload }: any) {
  console.log(payload, type, '=====payload');

  switch (type) {
    case InterfaceActions.setViewContract: {
      const { viewContract } = payload;
      console.log(viewContract, '====viewContract');
      const { viewContracts } = state;
      return Object.assign({}, state, { viewContracts: Object.assign({}, viewContracts, viewContract) });
    }
    default: {
      const { destroy } = payload;
      if (destroy) return Object.assign({}, payload);
      return Object.assign({}, state, payload);
    }
  }
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const currentNetwork = useCurrentNetwork();
  const prevRpcUrl = usePrevious(currentNetwork.rpcUrl);
  useEffect(() => {
    if (currentNetwork.chainType === 'aelf') {
      if (prevRpcUrl !== currentNetwork.rpcUrl) dispatch(setCurrentInterface(getAelfInstance(currentNetwork.rpcUrl)));
    } else {
      // TODO:ethereum
    }
  }, [currentNetwork.chainType, currentNetwork.rpcUrl, prevRpcUrl]);
  return (
    <InterfaceContext.Provider value={useMemo(() => [state, dispatch], [state, dispatch])}>
      {children}
    </InterfaceContext.Provider>
  );
}
