export type ActivityItemType = {
  chainId: String;
  token: {
    id: String;
    chainId: String;
    symbol: String;
    address: String;
  };
  from: String;
  to: String;
  transactionId: String;
  amount: number;
  type: number; // 0: login, 1；transfer
  timestamp: number;
};

export type the2ThFailedActivityItemType = {
  timestamp: number;
  transactionId: string;
};
