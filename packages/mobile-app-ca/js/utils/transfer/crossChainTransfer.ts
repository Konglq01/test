import { ChainType } from '@portkey/types';
import { BaseToken } from '@portkey/types/types-ca/token';
import { getChainIdByAddress } from '@portkey/utils';
import { crossChainTransferToCa } from './crossChainTransferToCa';
import { managerTransfer } from './ManagerTransfer';
import { getChainNumber } from '@portkey/utils/aelf';
import { ContractBasic } from '@portkey/contracts/utils/ContractBasic';

export type CrossChainTransferIntervalParams = Omit<CrossChainTransferParams, 'caHash'>;

export const intervalCrossChainTransfer = async (params: CrossChainTransferIntervalParams, count = 0) => {
  const { contract, managerAddress, chainType, amount, tokenInfo, memo = '', toAddress } = params;
  const issueChainId = getChainIdByAddress(managerAddress, chainType);
  const toChainId = getChainIdByAddress(toAddress, chainType);
  try {
    await crossChainTransferToCa({
      contract,
      paramsOption: {
        issueChainId: getChainNumber(issueChainId),
        toChainId: getChainNumber(toChainId),
        symbol: tokenInfo.symbol,
        to: toAddress,
        amount,
        memo,
      },
    });
  } catch (error) {
    console.log(error, 'error===sendHandler--intervalCrossChainTransfer');
    count++;
    if (count > 5) throw error;
    await intervalCrossChainTransfer(params, count);
  }
};

interface CrossChainTransferParams {
  contract: ContractBasic;
  chainType: ChainType;
  managerAddress: string;
  tokenInfo: BaseToken;
  caHash: string;
  amount: number;
  toAddress: string;
  memo?: string;
}
const crossChainTransfer = async ({
  chainType,
  contract,
  managerAddress,
  caHash,
  amount,
  tokenInfo,
  memo = '',
  toAddress,
}: CrossChainTransferParams) => {
  let managerTransferResult;
  try {
    // first transaction:transfer to manager itself
    managerTransferResult = await managerTransfer({
      contract,
      paramsOption: {
        caHash,
        symbol: tokenInfo.symbol,
        to: managerAddress,
        amount,
        memo,
      },
    });
    console.log(managerTransferResult, 'sendHandler===managerTransfer');
  } catch (error) {
    throw {
      type: 'managerTransfer',
      error: error,
    };
  }

  // second transaction:crossChain transfer to toAddress

  // TODO Only support chainType: aelf
  const CrossChainTransferParams = {
    contract,
    chainType,
    managerAddress,
    amount,
    tokenInfo,
    memo,
    toAddress,
  };
  try {
    const crossResult = await intervalCrossChainTransfer(CrossChainTransferParams);
    console.log(crossResult, 'crossResult===sendHandler');
  } catch (error) {
    throw {
      type: 'crossChainTransfer',
      error: error,
      managerTransferTxId: managerTransferResult.transactionId,
      data: CrossChainTransferParams,
    };
  }
};

export default crossChainTransfer;
