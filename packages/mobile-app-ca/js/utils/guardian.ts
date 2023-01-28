import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { GuardiansStatus } from 'pages/Guardian/components/GuardianAccountItem';
import { EditGuardianParamsType } from 'pages/Guardian/GuardianApproval';
import { ContractBasic } from './contract';

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

  const guardiansApproved = userGuardiansList
    .map(guardian => {
      if (!guardiansStatus[guardian.key] || !guardiansStatus[guardian.key].editGuardianParams) return null;
      return {
        value: guardian.guardianAccount,
        type: guardian.guardianType,
        verificationInfo: {
          id: guardian.verifier?.id,
          signature: Object.values(
            Buffer.from(guardiansStatus[guardian.key].editGuardianParams?.signature as any, 'hex'),
          ),
          verificationDoc: guardiansStatus[guardian.key].editGuardianParams?.verifierDoc,
        },
      };
    })
    .filter(item => item !== null);
  // TODO: remove console&req in this page
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
  editGuardianParams: EditGuardianParamsType,
  guardianItem: UserGuardianItem,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
) {
  const guardianToAdd = {
    value: guardianItem.guardianAccount,
    type: guardianItem.guardianType,
    verificationInfo: {
      id: guardianItem.verifier?.id,
      signature: Object.values(Buffer.from(editGuardianParams.signature as any, 'hex')),
      verificationDoc: editGuardianParams.verifierDoc,
    },
  };

  const guardiansApproved = userGuardiansList
    .map(guardian => {
      if (!guardiansStatus[guardian.key] || !guardiansStatus[guardian.key].editGuardianParams) return null;
      return {
        value: guardian.guardianAccount,
        type: guardian.guardianType,
        verificationInfo: {
          id: guardian.verifier?.id,
          signature: Object.values(
            Buffer.from(guardiansStatus[guardian.key].editGuardianParams?.signature as any, 'hex'),
          ),
          verificationDoc: guardiansStatus[guardian.key].editGuardianParams?.verifierDoc,
        },
      };
    })
    .filter(item => item !== null);

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

  const guardiansApproved = userGuardiansList
    .map(guardian => {
      if (!guardiansStatus[guardian.key] || !guardiansStatus[guardian.key].editGuardianParams) return null;
      return {
        value: guardian.guardianAccount,
        type: guardian.guardianType,
        verificationInfo: {
          id: guardian.verifier?.id,
          signature: Object.values(
            Buffer.from(guardiansStatus[guardian.key].editGuardianParams?.signature as any, 'hex'),
          ),
          verificationDoc: guardiansStatus[guardian.key].editGuardianParams?.verifierDoc,
        },
      };
    })
    .filter(item => item !== null);

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

export async function removeManager(contract: ContractBasic, address: string, caHash: string) {
  return await contract?.callSendMethod('RemoveManager', address, {
    caHash,
    manager: {
      managerAddress: address,
      deviceString: new Date().getTime(),
    },
  });
}
