import { sleep } from '@portkey/utils';
import AElf from 'aelf-sdk';

const Wallet = AElf.wallet;

async function getTxResultCycle(TransactionId: string, reGetCount = 0, txFun: (txId: string) => any): Promise<string> {
  const txResult = await txFun(TransactionId);
  if (txResult.error && txResult.errorMessage) {
    throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
  }
  const result = txResult?.result || txResult;

  if (!result) {
    throw Error('Can not get transaction result.');
  }

  if (result.Status.toLowerCase() === 'pending') {
    if (reGetCount > 10) {
      return TransactionId;
    }
    await sleep(1000);
    reGetCount++;
    return getTxResultCycle(TransactionId, reGetCount, txFun);
  }

  if (result.Status.toLowerCase() === 'mined') {
    return TransactionId;
  }

  throw Error(result.Error || 'Transaction error');
}

export async function getTxResult(aelfInstance: any, TransactionId: string, reGetCount = 0): Promise<any> {
  const txFun = aelfInstance.chain.getTxResult;
  return getTxResultCycle(TransactionId, reGetCount, txFun);
}
