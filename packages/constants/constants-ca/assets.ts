import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

export enum TransactionError {
  TOKEN_NOT_ENOUGH = 'Insufficient funds',
  NFT_NOT_ENOUGH = 'Insufficient quantity',
  FEE_NOT_ENOUGH = 'Insufficient funds for transaction fee',
  CROSS_NOT_ENOUGH = 'Insufficient funds for cross-chain transaction fee',
}

export const REFRESH_TIME = 5 * 60 * 1000; // 5min refresh

export const NEW_CLIENT_MOCK_ELF_LIST: TokenItemShowType[] = [
  {
    name: 'AELF',
    address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    balance: '0',
    balanceInUsd: '0.000000',
    chainId: 'AELF',
    decimals: 8,
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf_token_logo.png',
    symbol: 'ELF',
    tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  },
];

export const PAGE_SIZE_IN_NFT_ITEM = 9;

export const ELF_SYMBOL = 'ELF';
