import { LoginType } from '@portkey/types/types-ca/wallet';

export enum GuardianMth {
  addGuardian = 'addGuardian',
  UpdateGuardian = 'UpdateGuardian',
  RemoveGuardian = 'RemoveGuardian',
  SetGuardianTypeForLogin = 'SetGuardianTypeForLogin',
  UnsetGuardianTypeForLogin = 'UnsetGuardianTypeForLogin',
}

export interface GuardianType {
  type: LoginType;
  guardianType: string;
}

export interface VerifierType {
  name: string;
  signature?: number[];
  verificationDoc?: string;
}

export interface GuardianItem {
  guardianType: GuardianType;
  verifier: VerifierType;
}

export interface GuardianAddType {
  caHash: string;
  guardianToAdd: GuardianItem;
  guardiansApproved: GuardianItem[];
}

export interface GuardianDelType {
  caHash: string;
  guardianToRemove: GuardianType;
  guardiansApproved: GuardianItem[];
}

export interface GuardianEditType {
  caHash: string;
  guardianToUpdatePre: GuardianType;
  guardianToUpdateNew: GuardianType;
  guardiansApproved: GuardianItem[];
}

export interface GuardianTypeForLoginAccount {
  caHash: string;
  guardianType: GuardianType;
}
