import { request } from '@portkey-wallet/api/api-did';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { ChainType } from '@portkey-wallet/types';
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
    guardianIdentifier?: string;
    loginGuardianAccount?: string;
    caHash?: string;
  };
}) => {
  if (paramsOption.guardianIdentifier) {
    return request.wallet.guardianIdentifiers({
      params: { chainId: DefaultChainId, guardianIdentifier: paramsOption.guardianIdentifier },
    });
  }
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callViewMethod, {
    rpcUrl,
    chainType,
    address,
    methodName: 'GetHolderInfo',
    paramsOption,
  });

  console.log(resMessage, 'resMessage===GetHolderInfo');

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      ...resMessage.message,
    },
  };
};

export const getHolderInfoByContract = async ({
  rpcUrl,
  chainType,
  address, // contract address
  paramsOption,
}: {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
  paramsOption: {
    guardianIdentifier?: string;
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

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      ...resMessage.message,
    },
  };
};
