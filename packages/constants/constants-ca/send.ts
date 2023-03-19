export enum TransactionError {
  SAME_ADDRESS = 'The sending address is the same as the receiving address.',
  INVALID_ADDRESS = 'Recipient address is invalid',
  TOKEN_NOT_ENOUGH = 'Insufficient funds',
  NFT_NOT_ENOUGH = 'Insufficient quantity',
  FEE_NOT_ENOUGH = 'Insufficient funds for transaction fee',
  CROSS_NOT_ENOUGH = 'Insufficient funds for cross chain transaction fee',
}

export const TransactionErrorArray = Object.values(TransactionError);
