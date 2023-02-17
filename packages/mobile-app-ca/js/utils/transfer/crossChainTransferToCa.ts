import { SendOptions } from '@portkey/contracts/types';
import { ContractBasic } from '@portkey/contracts/utils/ContractBasic';

export const crossChainTransferToCa = ({
  contract,
  paramsOption,
  sendOptions,
}: {
  contract: ContractBasic;
  paramsOption: {
    issueChainId: string;
    toChainId: string;
    symbol: string;
    to: string;
    amount: number;
    memo?: string;
  };
  sendOptions?: SendOptions;
}) => {
  return contract.callSendMethod('CrossChainTransfer', '', {
    paramsOption,
    sendOptions,
  });
};
