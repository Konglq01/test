import { unitConverter } from './converter';
import { DEFAULT_AMOUNT, DEFAULT_DECIMAL, DEFAULT_DIGITS } from '@portkey/constants/constants-ca/activity';
import { ZERO } from '@portkey/constants/misc';
import { MAIN_CHAIL, MAIN_CHAIN_ID, SIDE_CHAIN, TEST_NET } from '@portkey/constants/constants-ca/network';

export function transNetworkText(chainId: string, isTestnet: boolean): string {
  return `${chainId === MAIN_CHAIN_ID ? MAIN_CHAIL : SIDE_CHAIN} ${chainId}${isTestnet ? ' ' + TEST_NET : ''}`;
}

export interface IFormatAmountProps {
  amount?: string | number;
  decimals?: string | number;
  digits?: number;
}

export function formatAmount({
  amount = DEFAULT_AMOUNT,
  decimals = DEFAULT_DECIMAL,
  digits = DEFAULT_DIGITS,
}: IFormatAmountProps): string {
  return `${unitConverter(ZERO.plus(amount).div(`1e${decimals}`), digits)}`;
}
