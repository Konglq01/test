import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { GuardianItem } from 'types/guardians';

export const formatDelGuardianValue = ({
  userGuardianStatus,
  opGuardian,
}: {
  userGuardianStatus?: {
    [x: string]: UserGuardianStatus;
  };
  opGuardian?: UserGuardianItem;

  preGuardian?: UserGuardianItem;
}) => {
  const guardianToRemove: GuardianItem = {
    type: opGuardian?.guardianType as LoginType,
    identifierHash: opGuardian?.identifierHash,
    verificationInfo: {
      id: opGuardian?.verifier?.id as string,
    },
  };
  const guardiansApproved: GuardianItem[] = [];
  Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
    if (item.signature) {
      guardiansApproved.push({
        type: item.guardianType,
        verificationInfo: {
          id: item.verifier?.id as string,
          signature: Object.values(Buffer.from(item.signature as any, 'hex')),
          verificationDoc: item.verificationDoc as string,
        },
        identifierHash: item.identifierHash,
      });
    }
  });
  return { guardianToRemove, guardiansApproved };
};
