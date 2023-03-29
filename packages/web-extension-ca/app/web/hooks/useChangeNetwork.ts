import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { useOriginChainId, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { changeNetworkType } from '@portkey-wallet/store/store-ca/wallet/actions';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';

export function useChangeNetwork() {
  const dispatch = useAppDispatch();
  const { walletInfo } = useWallet();
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const originChainId = useOriginChainId();

  return useCallback(
    (network: NetworkItem) => {
      const { caInfo } = walletInfo || {};
      const tmpCaInfo = caInfo?.[network.networkType];

      if (tmpCaInfo?.managerInfo && tmpCaInfo?.[originChainId]?.caAddress) {
        if (!isPrompt) {
          navigate('/');
        } else {
          navigate('/success-page/login');
        }
      } else {
        if (!isPrompt) {
          InternalMessage.payload(PortkeyMessageTypes.LOGIN_WALLET).send();
        } else {
          navigate('/register/start');
        }
      }

      dispatch(changeNetworkType(network.networkType));
    },
    [walletInfo, isPrompt, originChainId, navigate, dispatch],
  );
}
