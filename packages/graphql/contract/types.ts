import { CaHolderManagerDto, GetCaHolderManagerInfoDto, LoginGuardianTypeDto } from './__generated__/types';

type GenerateType<T> = {
  [K in keyof T]: T[K];
};

type PartialOption<T, K extends keyof T> = GenerateType<Partial<Pick<T, K>> & Omit<T, K>>;

interface GraphqlRequestCommonType {
  skipCount: any;
  maxResultCount: any;
}

type GraphqlCommonOption<T> = T extends GraphqlRequestCommonType ? PartialOption<T, 'skipCount' | 'maxResultCount'> : T;

//getCAHolderByManager
export type GetCAHolderByManagerParamsType = Required<Pick<GetCaHolderManagerInfoDto, 'manager' | 'chainId'>>;

export type CaHolderWithGuardian = CaHolderManagerDto & {
  loginGuardianTypeInfo: Array<LoginGuardianTypeDto | null>;
};
