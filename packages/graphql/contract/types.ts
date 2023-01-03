import { PartialOption } from '@portkey/types/common';
import {
  CaHolderManagerDto,
  GetCaHolderManagerInfoDto,
  GetCaHolderTransactionDto,
  GetLoginGuardianTypeInfoDto,
  GetNftProtocolInfoDto,
  GetTokenInfoDto,
  LoginGuardianTypeDto,
} from './__generated__/resolversTypes';

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
