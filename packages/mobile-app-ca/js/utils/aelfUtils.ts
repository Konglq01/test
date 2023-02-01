import AElf from 'aelf-sdk';
import { sleep } from '@portkey/utils';
const { wallet: Wallet } = AElf;
const wallet = Wallet.getWalletByPrivateKey('28805dd286a972f0ff268ba42646d5d952d770141bfec55c98e10619c268ecea');

export function getDefaultWallet() {
  return wallet;
}

export async function getTxResult(
  aelfInstance: any,
  TransactionId: string,
  reGetCount = 0,
  notExistedReGetCount = 0,
): Promise<any> {
  const txFun = aelfInstance.chain.getTxResult;
  const txResult = await txFun(TransactionId);
  console.log(txResult, reGetCount, '====txResult');

  if (txResult.error && txResult.errorMessage) {
    throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
  }
  const result = txResult?.result || txResult;

  if (!result) {
    throw Error('Can not get transaction result.');
  }
  const lowerCaseStatus = result.Status.toLowerCase();

  if (lowerCaseStatus === 'notexisted') {
    if (notExistedReGetCount > 5) return result;
    await sleep(1000);
    notExistedReGetCount++;
    reGetCount++;
    return getTxResult(aelfInstance, TransactionId, reGetCount, notExistedReGetCount);
  }

  if (lowerCaseStatus === 'pending' || lowerCaseStatus === 'pending_validation') {
    if (reGetCount > 20) return result;
    await sleep(1000);
    reGetCount++;
    return getTxResult(aelfInstance, TransactionId, reGetCount, notExistedReGetCount);
  }

  if (lowerCaseStatus === 'mined') {
    return result;
  }

  throw Error(result.Error || `Transaction: ${result.Status}`);
}
