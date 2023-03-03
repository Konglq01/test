import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { getAelfInstance } from '@portkey-wallet/utils/aelf';
import { BasicActions, getELFContract } from 'contexts/utils';
import usePrevious from 'hooks/usePrevious';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { getDefaultWallet } from 'utils/aelfUtils';
import { setCurrentInterface, setViewContracts } from './actions';
import { State } from './types';

const INITIAL_STATE = {};
const InterfaceContext = createContext<any>(INITIAL_STATE);

export function useInterface(): [State, BasicActions] {
  return useContext(InterfaceContext);
}

//reducer
function reducer(state: State, { type, payload }: any) {
  switch (type) {
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
  const initContract = useCallback(async () => {
    if (currentNetwork.basicContracts && currentNetwork.rpcUrl) {
      const viewContracts: any = {};
      await Promise.all(
        Object.entries(currentNetwork.basicContracts).map(async ([key, value]) => {
          viewContracts[key] = await getELFContract({
            contractAddress: value,
            rpcUrl: currentNetwork.rpcUrl,
            account: getDefaultWallet(),
          });
        }),
      );
      dispatch(setViewContracts(viewContracts));
    } else {
      dispatch(setViewContracts(undefined));
    }
  }, [currentNetwork.basicContracts, currentNetwork.rpcUrl]);
  useEffect(() => {
    initContract();
  }, [initContract]);
  return (
    <InterfaceContext.Provider value={useMemo(() => [state, dispatch], [state, dispatch])}>
      {children}
    </InterfaceContext.Provider>
  );
}
