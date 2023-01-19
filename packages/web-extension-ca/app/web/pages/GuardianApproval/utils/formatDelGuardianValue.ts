import { UserGuardianItem, UserGuardianStatus } from '@portkey/store/store-ca/guardians/type';
import { LoginType } from '@portkey/types/types-ca/wallet';
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
    guardianType: {
      type: opGuardian?.guardianType as LoginType,
      guardianType: opGuardian?.guardianAccount as string,
    },
    verifier: {
      name: opGuardian?.verifier?.name as string,
    },
  };
  const guardiansApproved: GuardianItem[] = [];
  Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
    if (item.signature) {
      guardiansApproved.push({
        guardianType: {
          type: item.guardianType,
          guardianType: item.guardianAccount,
        },
        verifier: {
          name: item.verifier?.name as string,
          signature: Object.values(Buffer.from(item.signature as any, 'hex')),
          verificationDoc: item.verificationDoc as string,
        },
      });
    }
  });
  return { guardianToRemove, guardiansApproved };
};
