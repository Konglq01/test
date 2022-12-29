import { PartialOption } from '@portkey/types/common';

// TokenInfo
export interface TokenInfoDto {
  id: String;
  chainId: String;
  blockHash: String;
  blockHeight: Number;
  previousBlockHash: String;
  symbol: String;
  tokenContractAddress: String;
  decimals: Number;
  totalSupply: Number;
  tokenName: String;
  issuer: String;
  isBurnable: Boolean;
  issueChainId: Number;
}
export interface GetTokenInfoDto {
  symbol?: String;
  chainId?: String;
  skipCount: Number;
  maxResultCount: Number;
}

export type SearchTokenInfoParamsType = PartialOption<GetTokenInfoDto, 'skipCount' | 'maxResultCount'>;

// NFTProtocolInfo
export interface NFTProtocolInfoDto {
  id: String;
  chainId: String;
  blockHash: String;
  blockHeight: Number;
  previousBlockHash: String;
  protocolName: String;
  symbol: String;
  tokenId: Number;
  owner: String;
  minter: String;
  quantity: Number;
  alias: String;
  baseUri: String;
  uri: String;
  creator: String;
  nftType: String;
  totalQuantity: Number;
  tokenHash: String;
  imageUrl: String;
}

export interface GetNFTProtocolInfoDto {
  symbol?: String;
  chainId?: String;
  skipCount: Number;
  maxResultCount: Number;
}

export type SearchNFTProtocolInfoParamsType = PartialOption<GetNFTProtocolInfoDto, 'skipCount' | 'maxResultCount'>;

// CAHolderTransaction
export interface CAHolderTransactionDto {
  id: String;
  chainId: String;
  blockHash: String;
  blockHeight: Number;
  previousBlockHash: String;
  transactionId: String;
  transactionType: String;
  tokenInfo: TokenInfo;
  nftInfo: NFTInfo;
  status: TransactionStatus;
  timestamp: Number;
  transferInfo: TransferInfo;
  fromAddress: String;
  transactionFees: TransactionFee[];
}

export interface TokenInfo {
  symbol: String;
  decimals: Number;
}

export interface NFTInfo {
  url: String;
  alias: String;
  nftId: Number;
}

enum TransactionStatus {
  NOT_EXISTED,
  PENDING,
  FAILED,
  MINED,
  CONFLICT,
  PENDING_VALIDATION,
  NODE_VALIDATION_FAILED,
}

export interface TransferInfo {
  fromAddress: String;
  toAddress: String;
  amount: Number;
  fromChainId: String;
  toChainId: String;
}

export interface TransactionFee {
  symbol: String;
  amount: Number;
}

export interface GetCAHolderTransactionDto {
  chainId?: String;
  address?: String;
  skipCount: Number;
  maxResultCount: Number;
}

export type SearchCAHolderTransactionParamsType = PartialOption<
  GetCAHolderTransactionDto,
  'skipCount' | 'maxResultCount'
>;

// CAHolderManager
export interface CAHolderManagerDto {
  id: String;
  chainId: String;
  caHash: String;
  caAddress: String;
  managers: ManagerInfo[];
}

export interface ManagerInfo {
  manager: String;
  deviceString: String;
}

export interface GetCAHolderManagerInfoDto {
  chainId?: String;
  caHash?: String;
  caAddress?: String;
  manager?: String;
  skipCount: Number;
  maxResultCount: Number;
}

export type SearchCAHolderManagerInfoParamsType = Omit<GetCAHolderManagerInfoDto, 'skipCount' | 'maxResultCount'>;

// LoginGuardianType
export interface LoginGuardianTypeDto {
  id: String;
  chainId: String;
  caHash: String;
  caAddress: String;
  loginGuardianType: String;
}

export interface GetLoginGuardianTypeInfoDto {
  chainId?: String;
  caHash?: String;
  caAddress?: String;
  loginGuardianType?: String;
  skipCount: Number;
  maxResultCount: Number;
}

export type SearchLoginGuardianTypeParamsType = PartialOption<
  GetLoginGuardianTypeInfoDto,
  'skipCount' | 'maxResultCount'
>;
