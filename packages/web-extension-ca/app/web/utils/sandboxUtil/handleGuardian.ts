import { ChainType } from '@portkey/types';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';

export const handleGuardian = async ({
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
  paramsOption: { method: string; params: any[] };
}) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
    rpcUrl: rpcUrl,
    address,
    privateKey,
    chainType,
    methodName: paramsOption.method,
    paramsOption: paramsOption.params,
  });
  console.log('--------contact params------------', paramsOption);
  console.log('--------contact res----------- ', resMessage);

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.message;
  const msg = resMessage.message;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      msg,
    },
  };
};
