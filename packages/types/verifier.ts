export enum VerifyStatus {
  NotVerified = 'NotVerified',
  Verifying = 'Verifying',
  Verified = 'Verified',
}
export interface VerifierItem {
  name: string;
  imageUrl: string;
  url: string;
  id: string;
}

// 0: register, 1: community recovery, 2: Add Guardian 3: Set LoginAccount
export enum VerificationType {
  register = 0,
  communityRecovery = 1,
  addGuardian = 2,
  setLoginAccount = 3,
}

export enum LoginType {
  email = 0,
  phone = 1,
}

export interface GuardiansInfo {
  guardians: {
    guardianType: {
      type: LoginType;
      guardianType: string;
    };
    verifier: {
      name: string;
      signature: string;
    };
  }[];
  loginGuardianTypeIndexes: number[];
}
