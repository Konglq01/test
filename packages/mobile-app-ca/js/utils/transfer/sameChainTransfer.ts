import { SendOptions } from '@portkey/contracts/types';
import { ContractBasic } from '@portkey/contracts/utils/ContractBasic';
import { BaseToken } from '@portkey/types/types-ca/token';
import { managerForwardCall } from './managerForwardCall';

const sameChainTransfer = async ({
  contract,
  caHash,
  amount,
  tokenInfo,
  memo = '',
  toAddress: to,
}: {
  contract: ContractBasic;
  tokenInfo: BaseToken;
  caHash: string;
  amount: number;
  toAddress: string;
  memo?: string;
  sendOptions?: SendOptions;
}) => {
  await managerForwardCall({
    contract,
    paramsOption: {
      caHash,
      contractAddress: tokenInfo.address,
      methodName: 'Transfer',
      args: {
        symbol: tokenInfo.symbol,
        to,
        amount,
        memo,
      },
    },
  });
};

export default sameChainTransfer;
