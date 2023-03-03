import { TLoginStrType } from './types-ca/wallet';

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

export interface GuardiansInfo {
  guardianList: Guardian[];
}

export interface Manager {
  managerAddress: string; //aelf.Address
  device_string: string;
}

export interface GuardiansApprovedType {
  type: TLoginStrType;
  value: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
}
