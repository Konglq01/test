import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { VerifierInfo } from '@portkey/types/verifier';
import { GuardiansStatus } from 'pages/Guardian/types';
import { ContractBasic } from './contract';

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

export async function deleteGuardian(
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
  // TODO: remove console&req in this page
  // TODO: remove async await
  console.log('RemoveGuardian', {
    caHash,
    guardianToRemove,
    guardiansApproved: guardiansApproved,
  });
  const req = await contract?.callSendMethod('RemoveGuardian', address, {
    caHash,
    guardianToRemove,
    guardiansApproved: guardiansApproved,
  });
  console.log('RemoveGuardian: req', req);
  return req;
}

export async function addGuardian(
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

  console.log('AddGuardian', {
    caHash,
    guardianToAdd: guardianToAdd,
    guardiansApproved: guardiansApproved,
  });
  const req = await contract?.callSendMethod('AddGuardian', address, {
    caHash,
    guardianToAdd: guardianToAdd,
    guardiansApproved: guardiansApproved,
  });
  console.log('AddGuardian: req', req);
  return req;
}

export async function editGuardian(
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

  console.log('UpdateGuardian', {
    caHash,
    guardianToUpdatePre,
    guardianToUpdateNew,
    guardiansApproved: guardiansApproved,
  });
  const req = await contract?.callSendMethod('UpdateGuardian', address, {
    caHash,
    guardianToUpdatePre,
    guardianToUpdateNew,
    guardiansApproved: guardiansApproved,
  });
  console.log('UpdateGuardian: req', req);
  return req;
}

export async function setLoginAccount(
  contract: ContractBasic,
  address: string,
  caHash: string,
  guardianItem: UserGuardianItem,
) {
  console.log('SetGuardianAccountForLogin', {
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
  const req = await contract?.callSendMethod('SetGuardianAccountForLogin', address, {
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
  console.log('SetGuardianAccountForLogin: req', req);
  return req;
}

export async function cancelLoginAccount(
  contract: ContractBasic,
  address: string,
  caHash: string,
  guardianItem: UserGuardianItem,
) {
  console.log('UnsetGuardianAccountForLogin', {
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

  const req = await contract?.callSendMethod('UnsetGuardianAccountForLogin', address, {
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
  console.log('UnsetGuardianAccountForLogin: req', req);
  return req;
}

export function removeManager(contract: ContractBasic, address: string, caHash: string) {
  return contract?.callSendMethod('RemoveManager', address, {
    caHash,
    manager: {
      managerAddress: address,
      deviceString: new Date().getTime(),
    },
  });
}
