import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { VerifierInfo } from '@portkey/types/verifier';
import { GuardiansStatus } from 'pages/Guardian/types';
import { ContractBasic } from '@portkey/contracts/utils/ContractBasic';

const getGuardiansApproved = (userGuardiansList: UserGuardianItem[], guardiansStatus: GuardiansStatus) => {
  return userGuardiansList
    .map(guardian => {
      if (!guardiansStatus[guardian.key] || !guardiansStatus[guardian.key].verifierInfo) return null;
      return {
        value: guardian.guardianAccount,
        type: guardian.guardianType,
        verificationInfo: {
          id: guardian.verifier?.id,
          signature: Object.values(Buffer.from(guardiansStatus[guardian.key].verifierInfo?.signature as any, 'hex')),
          verificationDoc: guardiansStatus[guardian.key].verifierInfo?.verificationDoc,
        },
      };
    })
    .filter(item => item !== null);
};

export function deleteGuardian(
  contract: ContractBasic,
  address: string,
  caHash: string,
  guardianItem: UserGuardianItem,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
) {
  const guardianToRemove = {
    value: guardianItem.guardianAccount,
    type: guardianItem.guardianType,
    verificationInfo: {
      id: guardianItem.verifier?.id,
    },
  };
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('RemoveGuardian', address, {
    caHash,
    guardianToRemove,
    guardiansApproved: guardiansApproved,
  });
}

export function addGuardian(
  contract: ContractBasic,
  address: string,
  caHash: string,
  verifierInfo: VerifierInfo,
  guardianItem: UserGuardianItem,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
) {
  const guardianToAdd = {
    value: guardianItem.guardianAccount,
    type: guardianItem.guardianType,
    verificationInfo: {
      id: guardianItem.verifier?.id,
      signature: Object.values(Buffer.from(verifierInfo.signature as any, 'hex')),
      verificationDoc: verifierInfo.verificationDoc,
    },
  };
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('AddGuardian', address, {
    caHash,
    guardianToAdd: guardianToAdd,
    guardiansApproved: guardiansApproved,
  });
}

export function editGuardian(
  contract: ContractBasic,
  address: string,
  caHash: string,
  preGuardianItem: UserGuardianItem,
  guardianItem: UserGuardianItem,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
) {
  const guardianToUpdatePre = {
    value: preGuardianItem.guardianAccount,
    type: preGuardianItem.guardianType,
    verificationInfo: {
      id: preGuardianItem.verifier?.id,
    },
  };
  const guardianToUpdateNew = {
    value: guardianItem.guardianAccount,
    type: guardianItem.guardianType,
    verificationInfo: {
      id: guardianItem.verifier?.id,
    },
  };
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('UpdateGuardian', address, {
    caHash,
    guardianToUpdatePre,
    guardianToUpdateNew,
    guardiansApproved: guardiansApproved,
  });
}

export function setLoginAccount(
  contract: ContractBasic,
  address: string,
  caHash: string,
  guardianItem: UserGuardianItem,
) {
  return contract?.callSendMethod('SetGuardianAccountForLogin', address, {
    caHash,
    guardianAccount: {
      value: guardianItem.guardianAccount,
      guardian: {
        type: guardianItem.guardianType,
        verifier: {
          id: guardianItem.verifier?.id,
        },
      },
    },
  });
}

export function cancelLoginAccount(
  contract: ContractBasic,
  address: string,
  caHash: string,
  guardianItem: UserGuardianItem,
) {
  return contract?.callSendMethod('UnsetGuardianAccountForLogin', address, {
    caHash,
    guardianAccount: {
      value: guardianItem.guardianAccount,
      guardian: {
        type: guardianItem.guardianType,
        verifier: {
          id: guardianItem.verifier?.id,
        },
      },
    },
  });
}

export function removeManager(contract: ContractBasic, address: string, caHash: string) {
  return contract?.callSendMethod('RemoveManagerInfo', address, {
    caHash,
    managerInfo: {
      address,
      extraData: new Date().getTime(),
    },
  });
}
