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
    loginGuardianAccount?: string;
    caHash?: string;
  };
}) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callViewMethod, {
    rpcUrl: 'http://192.168.67.35:8000',
    chainType,
    address: '2RHf2fxsnEaM3wb6N1yGqPupNZbcCY98LgWbGSFWmWzgEs5Sjo',
    methodName: 'GetHolderInfo',
    paramsOption: {
      caHash: 'f603f5cf3d88dea80b4495ac9a78275be32e038e06535a6785c766dc9c9d55c8',
    },
  });

  console.log(resMessage, 'resMessage===GetHolderInfo');

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.message;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      ...resMessage.message,
    },
  };
};
