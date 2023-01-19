import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierItem, VerifyStatus } from '@portkey/types/verifier';

type VerifyName = string;
type UserGuardianItemKey = string;

export interface UserGuardianItem {
  isLoginAccount: boolean | undefined;
  verifier?: VerifierItem;
  guardianAccount: string;
  guardianType: LoginType;
  key: string; // `${loginGuardianType}&${verifier?.name}`,
  sessionId?: string;
  isInitStatus?: boolean;
}

export interface UserGuardianStatus extends UserGuardianItem {
  status?: VerifyStatus;
  sessionId?: string;
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
