import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { message } from 'antd';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useCallback } from 'react';
import { SendResponseParams } from 'types';
import { setLocalStorage } from 'utils/storage/chromeStorage';

export const completeRegistration = async () => {
  await setLocalStorage({ registerStatus: 'Registered' });
  await InternalMessage.payload(PortkeyMessageTypes.CLOSE_PROMPT, { isClose: false }).send();
};

export const useLockWallet = () => {
  return useCallback(async () => {
    try {
      await InternalMessage.payload(PortkeyMessageTypes.LOCK_WALLET).send();
    } catch (error) {
      message.error('Lock error');
    }
  }, []);
};

export const useActiveLockStatusAction = () => {
  return useCallback(async () => {
    try {
      await InternalMessage.payload(PortkeyMessageTypes.ACTIVE_LOCK_STATUS).send();
    } catch (error) {
      message.error('Active lock error');
    }
  }, []);
};

export const setPinAction = async (pin: string) => {
  await InternalMessage.payload(PortkeyMessageTypes.SET_SEED, pin).send();
};

const loginUrl = 'http://localhost:3000/extension-login';

export const socialLoginAction = async (type: ISocialLogin): Promise<SendResponseParams> =>
  await InternalMessage.payload(PortkeyMessageTypes.SOCIAL_LOGIN, { externalLink: `${loginUrl}/${type}` }).send();
