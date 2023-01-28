import {
  CaHolderManagerDto,
  GetCaHolderManagerInfoDto,
  GetCaHolderTokenBalanceDto,
  GetCaHolderTransactionAddressDto,
  GetCaHolderTransactionDto,
  GetLoginGuardianTypeInfoDto,
  GetNftProtocolInfoDto,
  GetTokenInfoDto,
  GetUserNftInfoDto,
  GetUserNftProtocolInfoDto,
  LoginGuardianTypeDto,
} from './__generated__/resolversTypes';

type GenerateType<T> = {
  [K in keyof T]: T[K];
};

type PartialOption<T, K extends keyof T> = GenerateType<Partial<Pick<T, K>> & Omit<T, K>>;

interface GraphqlRequestCommonType {
  skipCount: any;
  maxResultCount: any;
}

type GraphqlCommonOption<T> = T extends GraphqlRequestCommonType ? PartialOption<T, 'skipCount' | 'maxResultCount'> : T;

// TokenInfo
export type GetTokenInfoParamsType = GraphqlCommonOption<GetTokenInfoDto>;

// NFTProtocolInfo
export type GetNftProtocolInfoParamsType = GraphqlCommonOption<GetNftProtocolInfoDto>;

// CAHolderTransaction

export type GetCaHolderTransactionParamsType = GraphqlCommonOption<GetCaHolderTransactionDto>;

// CAHolderManager
export type GetCaHolderManagerInfoParamsType = GraphqlCommonOption<GetCaHolderManagerInfoDto>;

export type GetCAHolderByManagerParamsType = Required<Pick<GetCaHolderManagerInfoDto, 'manager' | 'chainId'>>;

export type CaHolderWithGuardian = CaHolderManagerDto & {
  loginGuardianTypeInfo: LoginGuardianTypeDto[];
};

// LoginGuardianType
export type GetLoginGuardianTypeParamsType = GraphqlCommonOption<GetLoginGuardianTypeInfoDto>;

// CAHolderTokenBalanceInfo
export type GetCaHolderTokenBalanceParamsType = GraphqlCommonOption<GetCaHolderTokenBalanceDto>;

// CAHolderTransactionAddressInfo
export type GetCaHolderTransactionAddressParamsType = GraphqlCommonOption<GetCaHolderTransactionAddressDto>;

// UserNftInfo
export type GetUserNftInfoParamsType = GraphqlCommonOption<GetUserNftInfoDto>;

// UserNftProtocolInfo
export type GetUserNftProtocolInfoParamsType = GraphqlCommonOption<GetUserNftProtocolInfoDto>;
