import { useCallback } from 'react';
import { useAppDispatch, useLoginInfo } from 'store/Provider/hooks';
import { setGuardiansAction } from '@portkey/store/store-ca/guardians/actions';
import { getGuardianList } from 'utils/sandboxUtil/getGuardianList';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { message } from 'antd';

const useGuardiansList = () => {
  const dispatch = useAppDispatch();
  const { loginAccount } = useLoginInfo();
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();

  const fetch = useCallback(async () => {
    try {
      if (!currentChain?.endPoint) return message.error('Could not find chain information');
      if (!loginAccount?.caHash) return message.error('Unable to find user information');
      const res = await getGuardianList({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        paramsOption: {
          caHash: loginAccount.caHash,
          loginGuardianType: loginAccount.loginGuardianType,
        },
      });
      dispatch(setGuardiansAction(res.result.guardiansInfo));
    } catch (error: any) {
      console.error(error, 'useGuardiansList===error');
      const errorMessage = error.message;
      throw errorMessage?.Error?.Message || errorMessage.message?.Message || errorMessage?.message;
    }
  }, [currentChain, currentNetwork, loginAccount, dispatch]);

  return fetch;
};

export default useGuardiansList;
