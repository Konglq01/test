import { ChainItemType } from '@portkey/store/store-ca/wallet/type';
import { ChainType } from '@portkey/types';
import { BaseToken } from '@portkey/types/types-ca/token';
import { getChainIdByAddress } from '@portkey/utils';
import { crossChainTransferToCa } from './crossChainTransferToCa';
import { managerTransfer } from './managerTransfer';
import { getChainNumber } from '@portkey/utils/aelf';
import { getBalance } from './getBalance';
import token from '@portkey/api/api-did/token';
import { ZERO } from '@portkey/constants/misc';
import { FEE } from '@portkey/constants/constants-ca/wallet';

export type CrossChainTransferIntervalParams = Omit<CrossChainTransferParams, 'caHash' | 'fee'>;

export const intervalCrossChainTransfer = async (params: CrossChainTransferIntervalParams, count = 0) => {
  const { chainInfo, chainType, privateKey, managerAddress, amount, tokenInfo, memo = '', toAddress } = params;
  const issueChainId = getChainIdByAddress(managerAddress, chainType);
  const toChainId = getChainIdByAddress(toAddress, chainType);
  console.log('error===sendHandler--intervalCrossChainTransfer------', params);
  try {
    const a = await crossChainTransferToCa({
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
    console.log(a, 'getBalance');
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
  fee: number;
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
  fee,
}: CrossChainTransferParams) => {
  const res1 = await getBalance({
    rpcUrl: chainInfo.endPoint,
    chainType: chainType,
    address: tokenInfo.address,
    paramsOption: {
      symbol: tokenInfo.symbol,
      owner: managerAddress,
    },
  });
  console.log(res1, 'res===getBalance1');

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
  console.log(managerAddress, 'managerAddress===');

  // second transaction:crossChain transfer to toAddress

  const res = await getBalance({
    rpcUrl: chainInfo.endPoint,
    chainType: chainType,
    address: tokenInfo.address,
    paramsOption: {
      symbol: tokenInfo.symbol,
      owner: managerAddress,
    },
  });

  console.log(res, 'res===getBalance');
  console.log(amount, 'res===getBalance amount');
  console.log(fee, 'res===getBalance fee');
  // return;
  // TODO Only support chainType: aelf
  const CrossChainTransferParams = {
    chainInfo,
    chainType,
    privateKey,
    managerAddress,
    amount: ZERO.plus(amount).minus(fee).toNumber(),
    tokenInfo,
    memo,
    toAddress,
  };
  try {
    const crossResult = await intervalCrossChainTransfer(CrossChainTransferParams);
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
