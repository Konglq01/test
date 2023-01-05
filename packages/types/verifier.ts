export enum VerifyStatus {
  NotVerified = 'NotVerified',
  Verifying = 'Verifying',
  Verified = 'Verified',
}
export interface VerifierItem {
  name: string;
  imageUrl: string;
  url: string;
}

// 0: register, 1: community recovery, 2: Add Guardian 3: Set LoginAccount 4: addManager
export enum VerificationType {
  register,
  communityRecovery,
  addGuardian,
  setLoginAccount,
  addManager,
}

export enum LoginType {
  email,
  phone,
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
