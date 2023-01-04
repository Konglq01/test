export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Long: any;
};

export type CaHolderManagerDto = {
  __typename?: 'CAHolderManagerDto';
  caAddress?: Maybe<Scalars['String']>;
  caHash?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  managers?: Maybe<Array<Maybe<ManagerInfo>>>;
};

export type CaHolderTokenBalanceDto = {
  __typename?: 'CAHolderTokenBalanceDto';
  balance: Scalars['Long'];
  caAddress?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
};

export type CaHolderTransactionAddressDto = {
  __typename?: 'CAHolderTransactionAddressDto';
  address?: Maybe<Scalars['String']>;
  addressChainId?: Maybe<Scalars['String']>;
  caAddress?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  transactionTime: Scalars['Long'];
};

export type CaHolderTransactionDto = {
  __typename?: 'CAHolderTransactionDto';
  blockHash?: Maybe<Scalars['String']>;
  blockHeight: Scalars['Long'];
  chainId?: Maybe<Scalars['String']>;
  fromAddress?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  nftInfo?: Maybe<NftInfo>;
  previousBlockHash?: Maybe<Scalars['String']>;
  status: TransactionStatus;
  timestamp: Scalars['Long'];
  tokenInfo?: Maybe<TokenInfo>;
  transactionFees?: Maybe<Array<Maybe<TransactionFee>>>;
  transactionId?: Maybe<Scalars['String']>;
  transactionType?: Maybe<Scalars['String']>;
  transferInfo?: Maybe<TransferInfo>;
};

export type GetCaHolderManagerInfoDto = {
  caAddress?: InputMaybe<Scalars['String']>;
  caHash?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['String']>;
  manager?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
};

export type GetCaHolderTokenBalanceDto = {
  caAddress?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
  symbol?: InputMaybe<Scalars['String']>;
};

export type GetCaHolderTransactionAddressDto = {
  caAddress?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
};

export type GetCaHolderTransactionDto = {
  address?: InputMaybe<Scalars['String']>;
  blockHash?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
  symbol?: InputMaybe<Scalars['String']>;
  transactionId?: InputMaybe<Scalars['String']>;
  transactionTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type GetLoginGuardianTypeInfoDto = {
  caAddress?: InputMaybe<Scalars['String']>;
  caHash?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['String']>;
  loginGuardianType?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
};

export type GetNftProtocolInfoDto = {
  chainId?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
  symbol?: InputMaybe<Scalars['String']>;
};

export type GetTokenInfoDto = {
  chainId?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
  symbol?: InputMaybe<Scalars['String']>;
};

export type LoginGuardianTypeDto = {
  __typename?: 'LoginGuardianTypeDto';
  caAddress?: Maybe<Scalars['String']>;
  caHash?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  loginGuardianType?: Maybe<Scalars['String']>;
};

export type ManagerInfo = {
  __typename?: 'ManagerInfo';
  deviceString?: Maybe<Scalars['String']>;
  manager?: Maybe<Scalars['String']>;
};

export type NftInfo = {
  __typename?: 'NFTInfo';
  alias?: Maybe<Scalars['String']>;
  nftId: Scalars['Long'];
  url?: Maybe<Scalars['String']>;
};

export type NftProtocolInfoDto = {
  __typename?: 'NFTProtocolInfoDto';
  alias?: Maybe<Scalars['String']>;
  baseUri?: Maybe<Scalars['String']>;
  blockHash?: Maybe<Scalars['String']>;
  blockHeight: Scalars['Long'];
  chainId?: Maybe<Scalars['String']>;
  creator?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  minter?: Maybe<Scalars['String']>;
  nftType?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  previousBlockHash?: Maybe<Scalars['String']>;
  protocolName?: Maybe<Scalars['String']>;
  quantity: Scalars['Long'];
  symbol?: Maybe<Scalars['String']>;
  tokenHash?: Maybe<Scalars['String']>;
  tokenId: Scalars['Long'];
  totalQuantity: Scalars['Long'];
  uri?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  caHolderManagerInfo?: Maybe<Array<Maybe<CaHolderManagerDto>>>;
  caHolderTokenBalanceInfo?: Maybe<Array<Maybe<CaHolderTokenBalanceDto>>>;
  caHolderTransaction?: Maybe<Array<Maybe<CaHolderTransactionDto>>>;
  caHolderTransactionAddressInfo?: Maybe<Array<Maybe<CaHolderTransactionAddressDto>>>;
  loginGuardianTypeInfo?: Maybe<Array<Maybe<LoginGuardianTypeDto>>>;
  nftProtocolInfo?: Maybe<Array<Maybe<NftProtocolInfoDto>>>;
  tokenInfo?: Maybe<Array<Maybe<TokenInfoDto>>>;
};


export type QueryCaHolderManagerInfoArgs = {
  dto?: InputMaybe<GetCaHolderManagerInfoDto>;
};


export type QueryCaHolderTokenBalanceInfoArgs = {
  dto?: InputMaybe<GetCaHolderTokenBalanceDto>;
};


export type QueryCaHolderTransactionArgs = {
  dto?: InputMaybe<GetCaHolderTransactionDto>;
};


export type QueryCaHolderTransactionAddressInfoArgs = {
  dto?: InputMaybe<GetCaHolderTransactionAddressDto>;
};


export type QueryLoginGuardianTypeInfoArgs = {
  dto?: InputMaybe<GetLoginGuardianTypeInfoDto>;
};


export type QueryNftProtocolInfoArgs = {
  dto?: InputMaybe<GetNftProtocolInfoDto>;
};


export type QueryTokenInfoArgs = {
  dto?: InputMaybe<GetTokenInfoDto>;
};

export type TokenInfo = {
  __typename?: 'TokenInfo';
  decimals: Scalars['Int'];
  symbol?: Maybe<Scalars['String']>;
};

export type TokenInfoDto = {
  __typename?: 'TokenInfoDto';
  blockHash?: Maybe<Scalars['String']>;
  blockHeight: Scalars['Long'];
  chainId?: Maybe<Scalars['String']>;
  decimals: Scalars['Int'];
  id?: Maybe<Scalars['String']>;
  isBurnable: Scalars['Boolean'];
  issueChainId: Scalars['Int'];
  issuer?: Maybe<Scalars['String']>;
  previousBlockHash?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  tokenContractAddress?: Maybe<Scalars['String']>;
  tokenName?: Maybe<Scalars['String']>;
  totalSupply: Scalars['Long'];
};

export type TransactionFee = {
  __typename?: 'TransactionFee';
  amount: Scalars['Long'];
  symbol?: Maybe<Scalars['String']>;
};

export enum TransactionStatus {
  Conflict = 'CONFLICT',
  Failed = 'FAILED',
  Mined = 'MINED',
  NodeValidationFailed = 'NODE_VALIDATION_FAILED',
  NotExisted = 'NOT_EXISTED',
  Pending = 'PENDING',
  PendingValidation = 'PENDING_VALIDATION'
}

export type TransferInfo = {
  __typename?: 'TransferInfo';
  amount: Scalars['Long'];
  fromAddress?: Maybe<Scalars['String']>;
  fromChainId?: Maybe<Scalars['String']>;
  toAddress?: Maybe<Scalars['String']>;
  toChainId?: Maybe<Scalars['String']>;
};
