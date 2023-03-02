import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export enum GuardianMth {
  addGuardian = 'addGuardian',
  UpdateGuardian = 'UpdateGuardian',
  RemoveGuardian = 'RemoveGuardian',
  SetGuardianTypeForLogin = 'SetGuardianAccountForLogin',
  UnsetGuardianTypeForLogin = 'UnsetGuardianAccountForLogin',
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

export interface verificationInfo {
  id: string;
  signature?: number[];
  verificationDoc?: string;
}

export interface GuardianItem {
  value: string;
  type: LoginType;
  verificationInfo: verificationInfo;
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
