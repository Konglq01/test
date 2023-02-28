export enum TransactionError {
  TOKEN_NOTE_ENOUGH = 'Insufficient funds',
  NFT_NOTE_ENOUGH = 'Insufficient quantity',
  FEE_NOTE_ENOUGH = 'Insufficient funds for transaction fee',
}

export const REFRESH_TIME = 5 * 60 * 1000; // 5min refresh

export const NEW_CLIENT_MOCK_ELF_LIST = [
  {
    balance: '0',
    balanceInUsd: '0.000000',
    chainId: 'AELF',
    decimals: 8,
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf_token_logo.png',
    symbol: 'ELF',
    tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  },
];
