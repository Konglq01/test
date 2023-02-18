import { ChainType } from '@portkey/types';
import { SandboxErrorCode } from '@portkey/utils/sandboxService';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService from 'service/SandboxEventService';

interface GetTransitionFeeParams {
  rpcUrl: string;
  contractAddress: string;
  chainType: ChainType;
  paramsOption: any;
  methodName: string;
  privateKey: string;
}

const getTransactionFee = async ({
  rpcUrl,
  contractAddress,
  paramsOption,
  chainType,
  methodName,
  privateKey,
}: GetTransitionFeeParams) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.getTransactionFee, {
    rpcUrl,
    address: contractAddress,
    paramsOption,
    chainType,
    methodName,
    privateKey,
  });

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      ...resMessage.message,
    },
  };
};

export default getTransactionFee;
