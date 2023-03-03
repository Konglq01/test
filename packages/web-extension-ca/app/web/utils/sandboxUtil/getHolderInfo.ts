import { request } from '@portkey-wallet/api/api-did';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { ChainType } from '@portkey-wallet/types';

export const getHolderInfo = async ({
  paramsOption,
}: {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
  paramsOption: {
    guardianIdentifier?: string;
    caHash?: string;
  };
}) =>
  request.wallet.guardianIdentifiers({
    params: { chainId: DefaultChainId, ...paramsOption },
  });
