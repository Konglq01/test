import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierItem, VerifyStatus } from '@portkey/types/verifier';

type VerifyName = string;
type UserGuardianItemKey = string;

export interface UserGuardianItem {
  isLoginAccount: boolean | undefined;
  verifier?: VerifierItem;
  loginGuardianType: string;
  guardiansType: LoginType;
  key: string; // `${loginGuardianType}&${verifier?.name}`,
  sessionId?: string;
}

export interface UserGuardianStatus extends UserGuardianItem {
  status?: VerifyStatus;
  sessionId?: string;
}

export interface GuardiansState {
  verifierMap?: { [x: VerifyName]: VerifierItem };
  userGuardiansList?: UserGuardianItem[];
  userGuardianStatus?: { [x: string]: UserGuardianStatus };
  currentGuardian?: UserGuardianItem;
  preGuardian?: UserGuardianItem;
  guardianExpiredTime?: number; // timestamp
}
