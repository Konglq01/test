import { store } from 'store';
import aes from '@portkey/utils/aes';
import AElf from 'aelf-sdk';
import { AElfWallet } from '@portkey/types/aelf';
export const getState = () => {
  return store.getState();
};

export const getWalletInfo = () => {
  return getState().wallet.walletInfo?.address;
};
export const getWallet = (password: string): AElfWallet | undefined => {
  const currentAccount = getState().wallet.walletInfo;
  if (!currentAccount) return;
  return AElf.wallet.getWalletByPrivateKey(aes.decrypt(currentAccount.AESEncryptPrivateKey, password));
};
export const getWalletPrivateKey = (password: string) => {
  const { AESEncryptPrivateKey } = getState().wallet.walletInfo || {};
  if (!AESEncryptPrivateKey) return;
  return aes.decrypt(AESEncryptPrivateKey, password) || '';
};
export const getWalletMnemonic = (password: string) => {
  const { AESEncryptMnemonic } = getState().wallet.walletInfo || {};
  if (!AESEncryptMnemonic) return;
  return aes.decrypt(AESEncryptMnemonic, password) || '';
};

export const checkPin = (pin: string) => {
  const { AESEncryptPrivateKey } = getState().wallet.walletInfo || {};
  if (!AESEncryptPrivateKey) return false;
  return !!aes.decrypt(AESEncryptPrivateKey, pin);
};
