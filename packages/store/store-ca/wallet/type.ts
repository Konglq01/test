import { ChainId, ChainType, NetworkType } from '@portkey/types';
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
  chainId: ChainId;
  chainName: string;
  endPoint: string;
  explorerUrl: string;
  caContractAddress: string;
}

export interface WalletState {
  walletAvatar: string;
  walletType: WalletType;
  walletName: string;
  currentNetwork: NetworkType;
  walletInfo?: CAWalletInfoType;
  chainList: ChainItemType[];
  chainInfo?: { [key in NetworkType]?: ChainItemType[] };
}
