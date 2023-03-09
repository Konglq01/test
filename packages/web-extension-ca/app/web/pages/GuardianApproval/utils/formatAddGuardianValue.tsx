import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { GuardianItem } from 'types/guardians';

export const formatAddGuardianValue = ({
  userGuardianStatus,
  opGuardian,
}: {
  userGuardianStatus?: {
    [x: string]: UserGuardianStatus;
  };
  opGuardian?: UserGuardianItem;
}) => {
  let guardianToAdd: GuardianItem = {} as GuardianItem;
  const guardiansApproved: GuardianItem[] = [];
  Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
    if (item.key === opGuardian?.key) {
      guardianToAdd = {
        value: item.guardianAccount,
        type: item.guardianType,
        verificationInfo: {
          id: item.verifier?.id as string,
          signature: Object.values(Buffer.from(item.signature as any, 'hex')),
          verificationDoc: item.verificationDoc || '',
        },
        identifierHash: item.identifierHash,
      };
    } else if (item.signature) {
      guardiansApproved.push({
        type: item.guardianType,
        value: item.guardianAccount,
        verificationInfo: {
          id: item.verifier?.id as string,
          signature: Object.values(Buffer.from(item.signature as any, 'hex')),
          verificationDoc: item.verificationDoc as string,
        },
        identifierHash: item.identifierHash,
      });
    }
  });
  return { guardianToAdd, guardiansApproved };
};
