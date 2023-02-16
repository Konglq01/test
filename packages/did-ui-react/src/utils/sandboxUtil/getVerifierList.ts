import { ChainType } from '@portkey/types';
import { SandboxErrorCode, SandboxEventService, SandboxEventTypes } from '@portkey/utils/sandboxService';
import { isExtension } from '..';
import PortkeyUIError from '../../constants/error';
import { contractErrorHandler } from '../errorHandler';
import contractInit from '../../store/contract';

interface VerifierListParams {
  sandboxId?: string;
  rpcUrl: string;
  address: string;
  chainType: ChainType;
}

export const getVerifierListOnExtension = async ({
  sandboxId,
  rpcUrl,
  chainType,
  address, // contract address
}: Omit<VerifierListParams, 'contract'>) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(
    SandboxEventTypes.callViewMethod,
    {
      rpcUrl,
      chainType,
      address,
      methodName: 'GetVerifierServers',
    },
    sandboxId,
  );

  if (resMessage.code === SandboxErrorCode.error) throw contractErrorHandler(resMessage.message);
  const verifierList = resMessage.message?.verifierServers;
  return verifierList;
};

export const getVerifierListOthers = async (params: Omit<VerifierListParams, 'sandboxId'>) => {
  const contract = await contractInit.getViewContract({
    rpcUrl: params.rpcUrl,
    address: params.address,
  });
  if (!contract) throw PortkeyUIError.getContractError;
  // TODO Need to deal result
  return contract.callViewMethod('GetVerifierServers');
};

export const getVerifierList = (params: VerifierListParams) => {
  const extension = isExtension();
  const { sandboxId } = params;
  if (extension) {
    if (!sandboxId) throw PortkeyUIError.sandboxIdRequired;
    return getVerifierListOnExtension(params);
  }
  // TODO
  return getVerifierListOthers(params);
};
