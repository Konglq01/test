import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierInfo, VerifyStatus } from '@portkey/types/verifier';

export type GuardianApproved = {
  type: typeof LoginStrType[LoginType];
  value: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
};

export type GuardiansApproved = GuardianApproved[];

export type EditGuardianParamsType = {
  signature: string;
  verifierDoc: string;
};

export type GuardiansStatusItem = {
  status: VerifyStatus;
  verifierResult: { verifierSessionId: string; endPoint: string };
  editGuardianParams?: EditGuardianParamsType;
  verifierInfo?: VerifierInfo;
};

export type GuardiansStatus = {
  [key: string]: GuardiansStatusItem;
};
