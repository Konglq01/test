import { ChainType } from '@portkey/types';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';

export const unsetGuardianTypeForLogin = async ({
  rpcUrl,
  chainType,
  address, // contract address
  privateKey,
  paramsOption,
}: {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
  privateKey: string;
  paramsOption: any[];
}) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
    rpcUrl: rpcUrl,
    address,
    privateKey,
    chainType,
    methodName: 'UnsetGuardianTypeForLogin',
    paramsOption,
  });

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.message;
  const info = resMessage.message;
  console.log(resMessage, 'unsetGuardianTypeForLogin===');
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      info: info,
    },
  };
};
