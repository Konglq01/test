export type ActivityItemType = {
  chainId: string;
  transactionType: string;
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
  amount: string;
  symbol: string;
  decimal?: string;
  priceInUsd?: string;
  nftInfo?: {
    imageUrl: string;
    alias: string;
    nftId: string;
  };
  transactionFees: {
    symbol: string;
    fee: string;
    feeInUsd: string;
  };
  listIcon?: string;
};
