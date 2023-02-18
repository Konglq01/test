import { ChainType } from '@portkey/types';
import { BaseToken } from '@portkey/types/types-ca/token';
import { getChainIdByAddress } from '@portkey/utils';
import { crossChainTransferToCa } from './crossChainTransferToCa';
import { managerTransfer } from './managerTransfer';
import { getChainNumber } from '@portkey/utils/aelf';
import { ContractBasic } from '@portkey/contracts/utils/ContractBasic';
import { ZERO } from '@portkey/constants/misc';
import { timesDecimals } from '@portkey/utils/converter';

export type CrossChainTransferIntervalParams = Omit<CrossChainTransferParams, 'caHash'>;

export const intervalCrossChainTransfer = async (params: CrossChainTransferIntervalParams, count = 0) => {
  const { tokenContract, managerAddress, chainType, amount, tokenInfo, memo = '', toAddress } = params;
  const issueChainId = getChainIdByAddress(managerAddress, chainType);
  const toChainId = getChainIdByAddress(toAddress, chainType);

  try {
    const crossChainResult = await crossChainTransferToCa({
      contract: tokenContract,
      paramsOption: {
        issueChainId: getChainNumber(issueChainId),
        toChainId: getChainNumber(toChainId),
        symbol: tokenInfo.symbol,
        to: toAddress,
        amount,
        memo,
      },
    });

    if (crossChainResult.error) throw crossChainResult.error;
  } catch (error) {
    console.log(error, 'error===sendHandler--intervalCrossChainTransfer');
    count++;
    if (count > 5) throw error;
    await intervalCrossChainTransfer(params, count);
  }
};

interface CrossChainTransferParams {
  tokenContract: ContractBasic;
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
  tokenContract,
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
    if (managerTransferResult.error) throw managerTransferResult.error;

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
    tokenContract,
    contract,
    chainType,
    managerAddress,
    // FIXME: delete logic
    amount: tokenInfo.symbol === 'ELF' ? ZERO.plus(amount).minus(timesDecimals(0.35, 8)).toFixed() : amount,
    tokenInfo,
    memo,
    toAddress,
  };

  try {
    await intervalCrossChainTransfer(CrossChainTransferParams);
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
