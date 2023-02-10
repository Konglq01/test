import { AElfInterface } from '@portkey/types/aelf';

export type SendOptions = {
  from?: string;
  gasPrice?: string;
  gas?: number;
  value?: number | string;
  nonce?: number;
  onMethod: 'transactionHash' | 'receipt' | 'confirmation';
};

export interface ContractProps {
  contractAddress: string;
  aelfContract?: any;
  aelfInstance?: AElfInterface;
  rpcUrl: string;
}

export interface ErrorMsg {
  name?: string;
  code?: number;
  message?: string;
}

export type CallViewMethod = (
  functionName: string,
  paramsOption?: any,
  callOptions?: {
    defaultBlock: number | string;
    options?: any;
    callback?: any;
  },
) => Promise<any | ErrorMsg>;

export type CallSendMethod = (
  functionName: string,
  account: string,
  paramsOption?: any,
  sendOptions?: SendOptions,
) => Promise<
  {
    error?: ErrorMsg;
    transactionId?: string;
  } & any
>;

export type ContractBasicErrorMsg = ErrorMsg;

export type AElfCallViewMethod = (functionName: string, paramsOption?: any) => Promise<any | ErrorMsg>;

export type AElfCallSendMethod = (
  functionName: string,
  paramsOption?: any,
  sendOptions?: SendOptions,
) => Promise<
  {
    error?: ErrorMsg;
    transactionId?: string;
  } & any
>;
