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
    guardianType: {
      type: guardianItem.guardiansType,
      guardianType: guardianItem.loginGuardianType,
    },
    verifier: {
      name: guardianItem.verifier?.name,
    },
  };

  const guardiansApproved = userGuardiansList
    .map(guardian => {
      if (!guardiansStatus[guardian.key] || !guardiansStatus[guardian.key].editGuardianParams) return null;
      return {
        guardianType: {
          type: guardian.guardiansType,
          guardianType: guardian.loginGuardianType,
        },
        verifier: {
          name: guardian.verifier?.name,
          signature: Object.values(
            Buffer.from(guardiansStatus[guardian.key].editGuardianParams?.signature as any, 'hex'),
          ),
          verificationDoc: guardiansStatus[guardian.key].editGuardianParams?.verifierDoc,
        },
      };
    })
    .filter(item => item !== null);

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
    guardianType: {
      type: guardianItem.guardiansType,
      guardianType: guardianItem.loginGuardianType,
    },
    verifier: {
      name: guardianItem.verifier?.name,
      signature: Object.values(Buffer.from(editGuardianParams.signature as any, 'hex')),
      verificationDoc: editGuardianParams.verifierDoc,
    },
  };

  const guardiansApproved = userGuardiansList
    .map(guardian => {
      if (!guardiansStatus[guardian.key] || !guardiansStatus[guardian.key].editGuardianParams) return null;
      return {
        guardianType: {
          type: guardian.guardiansType,
          guardianType: guardian.loginGuardianType,
        },
        verifier: {
          name: guardian.verifier?.name,
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
    guardianType: {
      type: preGuardianItem.guardiansType,
      guardianType: preGuardianItem.loginGuardianType,
    },
    verifier: {
      name: preGuardianItem.verifier?.name,
    },
  };
  const guardianToUpdateNew = {
    guardianType: {
      type: guardianItem.guardiansType,
      guardianType: guardianItem.loginGuardianType,
    },
    verifier: {
      name: guardianItem.verifier?.name,
    },
  };

  const guardiansApproved = userGuardiansList
    .map(guardian => {
      if (!guardiansStatus[guardian.key] || !guardiansStatus[guardian.key].editGuardianParams) return null;
      return {
        guardianType: {
          type: guardian.guardiansType,
          guardianType: guardian.loginGuardianType,
        },
        verifier: {
          name: guardian.verifier?.name,
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
  console.log('SetGuardianTypeForLogin', {
    caHash,
    guardianType: {
      type: guardianItem.guardiansType,
      guardianType: guardianItem.loginGuardianType,
    },
  });
  const req = await contract?.callSendMethod('SetGuardianTypeForLogin', address, {
    caHash,
    guardianType: {
      type: guardianItem.guardiansType,
      guardianType: guardianItem.loginGuardianType,
    },
  });
  console.log('SetGuardianTypeForLogin: req', req);
  return req;
}

export async function cancelLoginAccount(
  contract: ContractBasic,
  address: string,
  caHash: string,
  guardianItem: UserGuardianItem,
) {
  const req = await contract?.callSendMethod('UnsetGuardianTypeForLogin', address, {
    caHash,
    guardianType: {
      type: guardianItem.guardiansType,
      guardianType: guardianItem.loginGuardianType,
    },
  });
  return req;
}

export async function removeManager(contract: ContractBasic, address: string, caHash: string) {
  const req = await contract?.callSendMethod('RemoveManager', address, {
    caHash,
    manager: {
      managerAddress: address,
      deviceString: new Date().getTime(),
    },
  });
  return req;
}
