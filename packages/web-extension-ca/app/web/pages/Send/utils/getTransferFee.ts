import { ZERO } from '@portkey/constants/misc';
import { ChainItemType } from '@portkey/store/store-ca/wallet/type';
import { ChainType } from '@portkey/types';
import { BaseToken } from '@portkey/types/types-ca/token';
import { isCrossChain } from '@portkey/utils/aelf';
import { divDecimalsStr } from '@portkey/utils/converter';
import getTransactionFee from 'utils/sandboxUtil/getTransactionFee';

const getTransferFee = async ({
  managerAddress,
  toAddress,
  privateKey,
  chainInfo,
  chainType,
  token,
  caHash,
  amount,
  memo = '',
}: {
  managerAddress: string;
  chainInfo: ChainItemType;
  chainType: ChainType;
  privateKey: string;
  toAddress: string;
  token: BaseToken;
  caHash: string;
  amount: number;
  memo?: string;
}) => {
  //
  if (isCrossChain(toAddress, chainInfo?.chainId ?? 'AELF')) {
    // TODO
    // first
    const firstTxResult = await getTransactionFee({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo?.endPoint || '',
      chainType,
      methodName: 'ManagerTransfer',
      privateKey,
      paramsOption: {
        caHash,
        symbol: token.symbol,
        to: managerAddress,
        amount,
        memo,
      },
    });
    const _firstFee = firstTxResult.result['ELF'];
    const firstFee = divDecimalsStr(ZERO.plus(_firstFee), 8);
    console.log(firstFee, 'transactionRes===');

    return '0.35';
  } else {
    //
    const transactionRes = await getTransactionFee({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo?.endPoint || '',
      chainType,
      methodName: 'ManagerForwardCall',
      privateKey,
      paramsOption: {
        caHash,
        contractAddress: token.address,
        methodName: 'Transfer',
        args: {
          symbol: token.symbol,
          to: toAddress,
          amount,
          memo,
        },
      },
    });
    console.log(transactionRes, 'transactionRes===');
    const feeRes = transactionRes.result['ELF'];
    return divDecimalsStr(ZERO.plus(feeRes), 8);
  }
};

export default getTransferFee;
