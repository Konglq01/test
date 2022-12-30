import { message } from 'antd';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useCallback } from 'react';
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

export const setPinAction = async (pin: string) => {
  console.log('setPinAction===');
  await InternalMessage.payload(PortkeyMessageTypes.SET_SEED, pin).send();
};
