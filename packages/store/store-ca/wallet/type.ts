import { NetworkItem } from '@portkey/constants/constants-ca/network';
import { ChainType, NetworkType } from '@portkey/types';
import { CAWalletInfoType } from '@portkey/types/types-ca/wallet';
import { PinErrorMessage } from '@portkey/utils/wallet/types';

export type WalletType = ChainType;

export enum BaseWalletError {
  noCreateWallet = 'Please Create an Wallet First!',
  pinFailed = 'Pin Verification Failed!',
  decryptionFailed = 'Decryption Failed!',
  invalidPrivateKey = 'Invalid Private Key',
  walletExists = 'Wallet Already Exists!',
  caAccountExists = 'Account Already Exists!',
}
export const WalletError = Object.assign({}, BaseWalletError, PinErrorMessage);

export interface ChainItemType {
  chainId: string;
  name: string;
  endPoint: string;
}

export interface WalletState {
  walletAvatar: string;
  walletType: WalletType;
  walletName: string;
  currentNetwork: NetworkType;
  networkList: NetworkItem[];
  walletInfo?: CAWalletInfoType;
  chainList: ChainItemType[];
}
