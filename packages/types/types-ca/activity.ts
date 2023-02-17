import { TransactionTypes } from '@portkey/constants/constants-ca/activity';

export type ActivityItemType = {
  chainId: string;
  transactionType: TransactionTypes;
  from: string; // wallet name
  to: string; // to user nick name
  fromAddress: string;
  toAddress: string;
  fromChainId: string;
  toChainId: string;
  status: string;
  transactionId: string;
  blockHash: string; // The chain may have forks, use transactionId and blockHash to uniquely determine the transaction
  timestamp: string;
  isReceived: boolean; // Is it a received transaction
  amount: string;
  symbol: string;
  decimals?: string;
  priceInUsd?: string;
  nftInfo?: NftInfo;
  transactionFees: TransactionFees[];
  listIcon?: string;
};

export type NftInfo = {
  imageUrl: string;
  alias: string;
  nftId: string;
};

export type TransactionFees = {
  symbol: string;
  fee: number;
  feeInUsd: string;
};

export type the2ThFailedActivityItemType = {
  timestamp: number;
  transactionId: string;
};
