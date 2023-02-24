export enum TransactionError {
  TOKEN_NOTE_ENOUGH = 'Insufficient funds',
  NFT_NOTE_ENOUGH = 'Insufficient quantity',
  FEE_NOTE_ENOUGH = 'Insufficient funds for transaction fee',
}

export const REFRESH_TIME = 5 * 60 * 1000; // 5min refresh
