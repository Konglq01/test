import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { VerifierItem, VerifyStatus } from '@portkey-wallet/types/verifier';

type VerifyName = string;
type UserGuardianItemKey = string;
export interface BaseGuardianItem {
  isLoginAccount: boolean | undefined;
  verifier?: VerifierItem;
  guardianAccount: string;
  guardianType: LoginType;
  key: string; // `${loginGuardianType}&${verifier?.name}`,
  identifierHash: string;
  salt: string;
}

export interface IVerifierInfo {
  sessionId: string;
  endPoint: string;
}

export interface UserGuardianItem extends BaseGuardianItem {
  verifierInfo?: IVerifierInfo;
  isInitStatus?: boolean;
}

export interface UserGuardianStatus extends UserGuardianItem {
  status?: VerifyStatus;
  signature?: string;
  verificationDoc?: string;
}

export interface GuardiansState {
  verifierMap?: { [x: VerifyName]: VerifierItem };
  userGuardiansList?: UserGuardianItem[];
  userGuardianStatus?: { [x: string]: UserGuardianStatus };
  currentGuardian?: UserGuardianItem;
  preGuardian?: UserGuardianItem;
  opGuardian?: UserGuardianItem;
  guardianExpiredTime?: number; // timestamp
}
