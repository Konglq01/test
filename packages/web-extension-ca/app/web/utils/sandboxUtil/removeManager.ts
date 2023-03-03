import { SendOptions } from '@portkey-wallet/contracts/types';
import { ChainType } from '@portkey-wallet/types';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';

export const removeManager = async ({
  rpcUrl,
  chainType,
  address, // contract address
  privateKey,
  sendOptions,
  paramsOption,
}: {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
  privateKey: string;
  sendOptions?: SendOptions;
  paramsOption: { caHash: string; manager: { managerAddress: string; deviceString: string } };
}) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
    rpcUrl: rpcUrl,
    address,
    privateKey,
    chainType,
    methodName: 'RemoveManager',
    sendOptions,
    paramsOption,
  });
  console.log(resMessage, 'resMessage===RemoveManager');
  if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
  const message = resMessage.message;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      message,
    },
  };
};
