import { ChainType } from '@portkey/types';
import { isExtension } from '@portkey/utils';
import PortkeyUIError from '../../constants/error';
import { SandboxEventService, SandboxEventTypes, SandboxErrorCode } from '@portkey/utils/sandboxService';
import contractInit from '../../store/contract';

interface GetHolderInfoParam {
  sandboxId?: string;
  rpcUrl: string;
  address: string; // contract address
  chainType: ChainType;
  paramsOption: {
    loginGuardianAccount?: string;
    caHash?: string;
  };
}

export const getHolderInfoOnExtension = async ({
  sandboxId,
  rpcUrl,
  chainType,
  address,
  paramsOption,
}: Omit<GetHolderInfoParam, 'contract'>) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(
    SandboxEventTypes.callViewMethod,
    {
      rpcUrl,
      chainType,
      address,
      methodName: 'GetHolderInfo',
      paramsOption,
    },
    sandboxId,
  );

  console.log(resMessage, 'resMessage===GetHolderInfo');

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.message;
  return resMessage.message;
};

export const getHolderInfoOthers = async (params: Omit<GetHolderInfoParam, 'sandboxId'>) => {
  const contract = await contractInit.getViewContract({
    rpcUrl: params.rpcUrl,
    address: params.address,
  });
  if (!contract) throw PortkeyUIError.getContractError;
  // TODO
  return contract.callViewMethod('GetHolderInfo');
};

export const getHolderInfo = async (params: GetHolderInfoParam) => {
  const extension = isExtension();
  const { sandboxId } = params;
  if (extension) {
    if (!sandboxId) throw PortkeyUIError.sandboxIdRequired;
    return getHolderInfoOnExtension(params);
  }
  // TODO
  return getHolderInfoOthers(params);
};
