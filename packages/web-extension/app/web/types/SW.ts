import { ChainState } from '@portkey-wallet/store/network/types';
import { WalletState } from '@portkey-wallet/store/wallet/type';
import { AutoLockDataType } from 'constants/lock';
import { RegisterStatus } from 'types';

export interface IPageState {
  lockTime: AutoLockDataType;
  registerStatus: RegisterStatus;
  chain: ChainState;
  wallet: WalletState;
}

export interface BaseInternalMessagePayload {
  from: string;
  hostname: string;
  href: string;
  method: string;
  origin: string;
}

export interface InternalMessagePayload extends BaseInternalMessagePayload {
  params: any;
}

export interface InternalMessageData {
  type: string;
  payload: any;
}
