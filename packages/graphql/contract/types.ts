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
export type SearchTokenInfoParamsType = GraphqlCommonOption<GetTokenInfoDto>;

// NFTProtocolInfo
export type SearchNFTProtocolInfoParamsType = GraphqlCommonOption<GetNftProtocolInfoDto>;

// CAHolderTransaction

export type SearchCAHolderTransactionParamsType = GraphqlCommonOption<GetCaHolderTransactionDto>;

// CAHolderManager
export type SearchCAHolderManagerInfoParamsType = GraphqlCommonOption<GetCaHolderManagerInfoDto>;

export type getCAHolderByManagerParamsType = Required<Pick<GetCaHolderManagerInfoDto, 'manager' | 'chainId'>>;

export type CaHolderWithGuardian = CaHolderManagerDto & {
  loginGuardianTypeInfo: LoginGuardianTypeDto[];
};

// LoginGuardianType
export type SearchLoginGuardianTypeParamsType = GraphqlCommonOption<GetLoginGuardianTypeInfoDto>;
