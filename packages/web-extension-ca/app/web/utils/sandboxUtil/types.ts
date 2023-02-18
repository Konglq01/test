import { SendOptions } from '@portkey/contracts/types';
import { ChainType } from '@portkey/types';

export interface BaseSendOption {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
  privateKey: string;
  sendOptions?: SendOptions;
}
