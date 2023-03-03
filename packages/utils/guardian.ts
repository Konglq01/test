import { GUARDIAN_TYPE_TYPE, LoginNumType } from '@portkey-wallet/constants/constants-ca/guardian';
import { ZERO } from '@portkey-wallet/constants/misc';
import { GuardiansInfo } from '@portkey-wallet/types/types-ca/guardian';
import { VerifierItem } from '@portkey-wallet/types/verifier';
const APPROVAL_COUNT = ZERO.plus(3).div(5);
import BigNumber from 'bignumber.js';

export function getApprovalCount(length: number) {
  if (length <= 3) return length;
  return APPROVAL_COUNT.times(length).dp(0, BigNumber.ROUND_DOWN).plus(1).toNumber();
}

export function handleVerificationDoc(verificationDoc: string) {
  const [type, guardianIdentifier, verificationTime, verifierAddress, salt] = verificationDoc.split(',');
  return { type, guardianIdentifier, verificationTime, verifierAddress, salt };
}

export function handleUserGuardiansList(
  holderInfo: GuardiansInfo,
  verifierServers: VerifierItem[] | { [key: string]: VerifierItem },
) {
  const { guardianList } = holderInfo;
  return guardianList.guardians.map(item => {
    return {
      ...item,
      guardianAccount: item.guardianIdentifier || item.identifierHash,
      guardianType: LoginNumType[item.type] ?? (GUARDIAN_TYPE_TYPE as any)[item.type],
      key: `${item.guardianIdentifier}&${item.verifierId}`,
      verifier: Array.isArray(verifierServers)
        ? verifierServers.find(verifierItem => verifierItem.id === item.verifierId)
        : verifierServers[item.verifierId],
      isLoginAccount: item.isLoginGuardian,
    };
  });
}
