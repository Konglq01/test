import { ChainItemType } from '@portkey/types/chain';
import { BaseToken } from '@portkey/types/types-eoa/token';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';

export const getBalance = async ({
  account,
  currentChain,
  tokenList,
}: {
  account: string;
  tokenList: BaseToken[];
  currentChain: ChainItemType;
}) => {
  if (!account) return;
  const balanceMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.getBalances, {
    tokens: tokenList,
    rpcUrl: currentChain.rpcUrl,
    account,
    chainType: currentChain.chainType,
  });
  if (balanceMessage.code === SandboxErrorCode.error) return balanceMessage;
  const balance = balanceMessage.message;
  const balances = tokenList.map((item, index) => ({
    symbol: item.symbol,
    balance: balance[index],
  }));
  return {
    code: balanceMessage.code,
    result: {
      rpcUrl: currentChain.rpcUrl,
      account,
      balances,
    },
  };
};
