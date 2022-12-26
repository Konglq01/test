import { ZERO } from '@portkey/constants/misc';
const APPROVAL_COUNT = ZERO.plus(3).div(5);
import BigNumber from 'bignumber.js';

export function getApprovalCount(length: number) {
  if (length < 3) return length;
  return APPROVAL_COUNT.times(length).dp(0, BigNumber.ROUND_DOWN).plus(1);
}
