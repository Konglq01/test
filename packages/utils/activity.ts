import { unitConverter } from './converter';
import { DEFAULT_AMOUNT, DEFAULT_DECIMAL, DEFAULT_DIGITS } from '@portkey/constants/constants-ca/activity';
import { ZERO } from '@portkey/constants/misc';
import { MAIN_CHAIN, MAIN_CHAIN_ID, SIDE_CHAIN, TEST_NET } from '@portkey/constants/constants-ca/activity';

export function transNetworkText(chainId: string, isTestnet: boolean): string {
  return `${chainId === MAIN_CHAIN_ID ? MAIN_CHAIN : SIDE_CHAIN} ${chainId}${isTestnet ? ' ' + TEST_NET : ''}`;
}

export interface IFormatAmountProps {
  amount?: string | number;
  decimals?: string | number;
  digits?: number;
  sign?: AmountSign;
}

export enum AmountSign {
  PLUS = '+',
  MINUS = '-',
  EMPTY = '',
}

export function formatAmount({
  amount = DEFAULT_AMOUNT,
  decimals = DEFAULT_DECIMAL,
  digits = DEFAULT_DIGITS,
  sign = AmountSign.EMPTY,
}: IFormatAmountProps): string {
  let amountTrans = `${unitConverter(
    ZERO.plus(amount).div(`1e${decimals || DEFAULT_DECIMAL}`),
    digits || DEFAULT_DIGITS,
  )}`;
  if (sign && amountTrans !== '0') {
    return `${sign}${amountTrans}`;
  }
  return amountTrans;
}
