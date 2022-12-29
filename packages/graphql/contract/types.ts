export interface GetTokenInfoDto {
  symbol?: String;
  chainId?: String;
  skipCount: Number;
  maxResultCount: Number;
}

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

export type SearchLoginGuardianTypeParamsType = Omit<GetLoginGuardianTypeInfoDto, 'skipCount' | 'maxResultCount'>;

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
