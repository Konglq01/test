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
    loginGuardianType: string;
  };
}) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callViewMethod, {
    rpcUrl,
    chainType,
    address,
    methodName: 'GetHolderInfo',
    paramsOption,
  });

  if (resMessage.code === SandboxErrorCode.error) throw resMessage;
  const guardiansInfo = resMessage.message?.guardiansInfo;
  console.log(resMessage, 'getGuardianLis===');
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      guardiansInfo: guardiansInfo,
    },
  };
};
