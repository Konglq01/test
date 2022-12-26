import { store } from 'store';
import aes from '@portkey/utils/aes';
import AElf from 'aelf-sdk';
import { AccountType } from '@portkey/types/wallet';
import { AElfWallet } from '@portkey/types/aelf';
export const getState = () => {
  return store.getState();
};

export const getWalletInfo = () => {
  return getState().wallet.walletInfo?.address;
};
export const getAccountList = () => {
  return getState().wallet.accountList;
};
export const getCurrentAccountPrivateKey = (password: string) => {
  const { AESEncryptPrivateKey } = getState().wallet.currentAccount || {};
  if (!AESEncryptPrivateKey) return;
  return aes.decrypt(AESEncryptPrivateKey, password) || '';
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

export const getCurrentAccount = (password: string, account: AccountType) => {
  const currentAccount = getState().wallet.currentAccount;
  if (!currentAccount) return;
  return AElf.wallet.getWalletByPrivateKey(
    aes.decrypt(account.AESEncryptPrivateKey ?? currentAccount.AESEncryptPrivateKey, password),
  );
};
export const getWalletByAccount = (address: string, password: string): AElfWallet | undefined => {
  const accountList = getAccountList();
  const account = accountList?.find(item => item.address === address);
  if (!account) return;
  const privateKey = aes.decrypt(account.AESEncryptPrivateKey, password);
  if (!privateKey) return;
  const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
  return wallet;
};
