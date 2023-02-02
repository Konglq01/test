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
    value: preGuardian?.guardianAccount as string,
    type: preGuardian?.guardianType as LoginType,
    verificationInfo: {
      id: preGuardian?.verifier?.id as string,
    },
  };
  const guardianToUpdateNew: GuardianItem = {
    value: opGuardian?.guardianAccount as string,
    type: opGuardian?.guardianType as LoginType,
    verificationInfo: {
      id: opGuardian?.verifier?.id as string,
    },
  };
  const guardiansApproved: GuardianItem[] = [];
  Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
    if (item.signature) {
      guardiansApproved.push({
        value: item.guardianAccount,
        type: item.guardianType,
        verificationInfo: {
          id: item.verifier?.id as string,
          signature: Object.values(Buffer.from(item.signature as any, 'hex')),
          verificationDoc: item.verificationDoc as string,
        },
      });
    }
  });
  return { guardianToUpdatePre, guardianToUpdateNew, guardiansApproved };
};
