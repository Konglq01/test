import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { TransactionTypes } from '@portkey/constants/constants-ca/activity';

export type ActivityStateType = {
  maxResultCount: number;
  skipCount: number;
  data: ActivityItemType[];
  totalRecordCount: number;
};

export interface IActivitysApiParams {
  maxResultCount: number;
  skipCount: number;
  caAddresses?: string[];
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
}
