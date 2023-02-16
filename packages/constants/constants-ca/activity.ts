export enum TransactionTypes {
  TRANSFER = 'Transfer',
  CROSS_CHAIN_TRANSFER = 'CrossChainTransfer',
  CROSS_CHAIN_RECEIVE_TOKEN = 'CrossChainReceiveToken',
  SOCIAL_RECOVERY = 'SocialRecovery',
  REMOVE_MANAGER = 'RemoveManager',
  ADD_MANAGER = 'AddManager',
}

export const transactionTypes = [
  TransactionTypes.TRANSFER,
  TransactionTypes.CROSS_CHAIN_TRANSFER,
  TransactionTypes.CROSS_CHAIN_RECEIVE_TOKEN,
  TransactionTypes.SOCIAL_RECOVERY,
  TransactionTypes.ADD_MANAGER,
  TransactionTypes.REMOVE_MANAGER,
];

export const transactionTypesForActivityList = [
  TransactionTypes.TRANSFER,
  TransactionTypes.CROSS_CHAIN_TRANSFER,
  // 'CrossChainReceiveToken', // activityListPage dont need this type
  TransactionTypes.SOCIAL_RECOVERY,
  TransactionTypes.ADD_MANAGER,
  TransactionTypes.REMOVE_MANAGER,
];

export const transactionTypesMap = (type: TransactionTypes, nftId?: string): string => {
  let newType: string = TransactionTypes.TRANSFER;
  switch (type) {
    case TransactionTypes.TRANSFER:
      if (nftId) {
        newType = TransactionTypes.TRANSFER + ' NFT';
      } else {
        newType = TransactionTypes.TRANSFER;
      }
      break;

    case TransactionTypes.CROSS_CHAIN_TRANSFER:
      if (nftId) {
        newType = TransactionTypes.CROSS_CHAIN_TRANSFER + ' NFT';
      } else {
        newType = TransactionTypes.CROSS_CHAIN_TRANSFER;
      }
      break;

    case TransactionTypes.SOCIAL_RECOVERY:
      newType = 'Social Recovery';
      break;

    case TransactionTypes.ADD_MANAGER:
      newType = 'Scan code login';
      break;

    case TransactionTypes.REMOVE_MANAGER:
      newType = 'Exit Wallet';
      break;
  }
  return newType;
};
