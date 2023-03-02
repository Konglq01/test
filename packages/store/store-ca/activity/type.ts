import { ActivityItemType, the2ThFailedActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';

export type ActivityStateType = {
  maxResultCount: number;
  skipCount: number;
  data: ActivityItemType[];
  totalRecordCount: number;
  isFetchingActivities: boolean;
  failedActivityMap: { [transactionId: string]: the2ThFailedActivityItemType };
};

export interface IActivitysApiParams {
  maxResultCount: number;
  skipCount: number;
  caAddresses?: string[];
  managerAddresses?: string[];
  transactionTypes?: TransactionTypes[];
  chainId?: string;
  symbol?: string;
}

export interface IActivitysApiResponse {
  data: ActivityItemType[];
  totalRecordCount: number;
}

export interface IActivityApiParams {
  transactionId: string;
  blockHash: string;
  caAddresses?: string[];
}
