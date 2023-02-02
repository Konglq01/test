import { DefaultChainId } from '@portkey/constants/constants-ca/network-test2';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useFetchWalletCAAddress } from '@portkey/hooks/hooks-ca/wallet-result';
import { resetWallet, setCAInfo } from '@portkey/store/store-ca/wallet/actions';
import { VerificationType } from '@portkey/types/verifier';
import { PinErrorMessage } from '@portkey/utils/wallet/types';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { setLocalStorage } from 'utils/storage/chromeStorage';

export default function useFetchDidWallet() {
  const fetchWalletResult = useFetchWalletCAAddress();
  const dispatch = useAppDispatch();
  const currentChain = useCurrentChain();
  const currentNetwork = useCurrentNetworkInfo();
  const navigate = useNavigate();

  const fetch = useCallback(
    async ({
      pwd,
      clientId,
      requestId,
      managerAddress,
      verificationType,
      managerUniqueId,
    }: {
      pwd: string;
      clientId: string;
      requestId: string;
      managerAddress: string;
      managerUniqueId: string;
      verificationType: VerificationType;
    }) => {
      if (!currentChain) throw 'Could not find chain information';
      const walletResult = await fetchWalletResult({
        clientId,
        requestId,
        verificationType,
        managerUniqueId,
      });
      try {
        walletResult.Socket.stop();
      } catch (error) {
        //
      }
      console.log(walletResult, 'walletResult===');
      if (walletResult.status !== 'pass') {
        const errorString = walletResult?.message || walletResult.status;
        await setLocalStorage({
          registerStatus: null,
        });
        dispatch(resetWallet());
        throw (errorString as string) || 'Something error';
      } else {
        if (!pwd) throw PinErrorMessage.invalidPin;
        try {
          const result = await getHolderInfo({
            rpcUrl: currentChain.endPoint,
            address: currentChain.caContractAddress,
            chainType: currentNetwork.walletType,
            paramsOption: {
              caHash: walletResult.caHash,
            },
          });

          const managerList: any[] = result.result.managers;

          if (!managerList.find((info) => info?.managerAddress === managerAddress))
            throw `${managerAddress} is not a manager`;

          dispatch(
            setCAInfo({
              caInfo: {
                caAddress: walletResult.caAddress,
                caHash: walletResult.caHash,
              },
              pin: pwd,
              chainId: DefaultChainId,
            }),
          );
          await setLocalStorage({
            registerStatus: 'Registered',
          });
          const path = VerificationType.register === verificationType ? 'register' : 'login';
          navigate(`/${path}/success`);
        } catch (error: any) {
          throw error?.Error?.Message || error.message?.Message || error?.message || error;
        }
      }
    },
    [currentChain, currentNetwork, dispatch, fetchWalletResult, navigate],
  );
  return fetch;
}
