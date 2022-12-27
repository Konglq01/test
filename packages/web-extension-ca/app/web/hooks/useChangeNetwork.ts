import { NetworkItem } from '@portkey/constants/constants-ca/network';
import { useWallet } from '@portkey/hooks/hooks-ca/wallet';
import { changeNetworkType } from '@portkey/store/store-ca/wallet/actions';
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

  return useCallback(
    (network: NetworkItem) => {
      const { caInfo } = walletInfo || {};
      const tmpCaInfo = caInfo?.[network.networkType];

      if (tmpCaInfo?.managerInfo && tmpCaInfo.AELF?.caAddress) {
        if (!isPrompt) {
          navigate('/');
        } else {
          navigate('/register/success', { state: 'login' });
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
    [dispatch, isPrompt, navigate, walletInfo],
  );
}
