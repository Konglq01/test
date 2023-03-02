import { ChainType } from '@portkey-wallet/types';
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
}: GetTransitionFeeParams) =>
  await SandboxEventService.dispatchAndReceive(SandboxEventTypes.getTransactionFee, {
    rpcUrl,
    address: contractAddress,
    paramsOption,
    chainType,
    methodName,
    privateKey,
  });

export default getTransactionFee;
