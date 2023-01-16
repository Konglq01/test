import { ChainType } from '@portkey/types';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';

export const getHolderInfo = async ({
  rpcUrl,
  chainType,
  address, // contract address
  paramsOption,
}: {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
  paramsOption: {
    loginGuardianType?: string;
    caHash?: string;
  };
}) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callViewMethod, {
    rpcUrl,
    chainType,
    address,
    methodName: 'GetHolderInfo',
    paramsOption,
  });

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.message;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      ...resMessage.message,
    },
  };
};
