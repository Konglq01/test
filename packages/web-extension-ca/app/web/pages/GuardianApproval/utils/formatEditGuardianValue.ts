import { UserGuardianItem, UserGuardianStatus } from '@portkey/store/store-ca/guardians/type';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { GuardianItem } from 'types/guardians';

export const formatEditGuardianValue = ({
  userGuardianStatus,
  opGuardian,
  preGuardian,
}: {
  userGuardianStatus?: {
    [x: string]: UserGuardianStatus;
  };
  opGuardian?: UserGuardianItem;

  preGuardian?: UserGuardianItem;
}) => {
  const guardianToUpdatePre: GuardianItem = {
    guardianType: {
      type: preGuardian?.guardianType as LoginType,
      guardianType: preGuardian?.guardianAccount as string,
    },
    verifier: {
      name: preGuardian?.verifier?.name as string,
    },
  };
  const guardianToUpdateNew: GuardianItem = {
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
  return { guardianToUpdatePre, guardianToUpdateNew, guardiansApproved };
};
