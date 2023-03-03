import { TLoginStrType } from './wallet';

export enum GuardianType {
  GUARDIAN_TYPE_OF_EMAIL = 0,
  GUARDIAN_TYPE_OF_PHONE = 1,
}

export interface Verifier {
  id: string; // aelf.Hash
}
export interface Guardian {
  guardianIdentifier: string;
  identifierHash: string;
  isLoginGuardian: true;
  salt: string;
  type: TLoginStrType;
  verifierId: string;
}

export interface GuardianAccount {
  guardian: Guardian;
  value: string;
}
export interface Manager {
  address: string; //aelf.Address
  extraData: string;
}
export interface GuardiansInfo {
  guardianList: { guardians: Guardian[] };
  managerInfos: Manager[];
}

export interface GuardiansApprovedType {
  type: TLoginStrType;
  identifier: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
}
