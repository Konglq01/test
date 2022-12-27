import { LoginType, VerifierItem, VerifyStatus } from '@portkey/types/verifier';

type VerifyName = string;
type UserGuardianItemKey = string;

export interface UserGuardianItem {
  isLoginAccount: boolean | undefined;
  verifier?: VerifierItem;
  loginGuardianType: string;
  guardiansType: LoginType;
  key: string; // `${loginGuardianType}&${verifier?.name}`,
  managerUniqueId?: string;
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
  guardianExpiredTime?: number; // timestamp
}
