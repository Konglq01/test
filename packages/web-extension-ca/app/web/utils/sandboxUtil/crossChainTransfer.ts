import { ChainItemType } from '@portkey/store/store-ca/wallet/type';
import { ChainType } from '@portkey/types';
import { BaseToken } from '@portkey/types/types-ca/token';
import { getChainIdByAddress } from '@portkey/utils';
import { crossChainTransferToCa } from './crossChainTransferToCa';
import { managerTransfer } from './managerTransfer';
import { getChainNumber } from '@portkey/utils/aelf';

export type CrossChainTransferIntervalParams = Omit<CrossChainTransferParams, 'caHash'>;

export const intervalCrossChainTransfer = async (params: CrossChainTransferIntervalParams, count = 0) => {
  const { chainInfo, chainType, privateKey, managerAddress, amount, tokenInfo, memo = '', toAddress } = params;
  const issueChainId = getChainIdByAddress(managerAddress, chainType);
  const toChainId = getChainIdByAddress(toAddress, chainType);
  try {
    await crossChainTransferToCa({
      rpcUrl: chainInfo.endPoint,
      address: tokenInfo.address,
      chainType,
      privateKey,
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
  chainInfo: ChainItemType;
  chainType: ChainType;
  privateKey: string;
  managerAddress: string;
  tokenInfo: BaseToken;
  caHash: string;
  amount: number;
  toAddress: string;
  memo?: string;
}
const crossChainTransfer = async ({
  chainInfo,
  chainType,
  privateKey,
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
      rpcUrl: chainInfo.endPoint,
      address: chainInfo.caContractAddress,
      chainType,
      privateKey,
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
    chainInfo,
    chainType,
    privateKey,
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
      managerTransferTxId: managerTransferResult.result.message.TransactionId,
      data: CrossChainTransferParams,
    };
  }
};

export default crossChainTransfer;
