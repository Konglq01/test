import { isEffectiveNumber, ZERO } from '@portkey/constants/misc';
import BigNumber from 'bignumber.js';
import i18n from 'i18next';

const zhList = [
    { value: 1e12, symbol: '萬億' },
    { value: 1e8, symbol: '億' },
    { value: 1e4, symbol: '萬' },
  ],
  enList = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];

export const fixedDecimal = (count?: number | BigNumber | string, num = 4) => {
  const bigCount = BigNumber.isBigNumber(count) ? count : new BigNumber(count || '');
  if (bigCount.isNaN()) return '0';
  return bigCount.dp(num, BigNumber.ROUND_DOWN).toFixed();
};

export const unitConverter = (num?: number | BigNumber | string, decimal = 4, defaultVal = '0') => {
  const bigNum = BigNumber.isBigNumber(num) ? num : new BigNumber(num || '');
  if (bigNum.isNaN() || bigNum.eq(0)) return defaultVal;
  const abs = bigNum.abs();
  const list = i18n.language === 'zh' ? zhList : enList;
  for (let i = 0; i < list.length; i++) {
    const { value, symbol } = list[i];
    if (abs.gte(value)) return fixedDecimal(bigNum.div(value), decimal) + symbol;
  }
  return fixedDecimal(bigNum, decimal);
};

export function divDecimals(a?: BigNumber.Value, decimals: string | number = 18) {
  if (!a) return ZERO;
  const bigA = ZERO.plus(a);
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) return bigA.div(decimals);
  return bigA.div(`1e${decimals}`);
}

export function divDecimalsStr(a?: BigNumber.Value, decimals: string | number = 8, defaultVal = '--') {
  const n = divDecimals(a, decimals);
  return isEffectiveNumber(n) ? n.toFormat() : defaultVal;
}

export function timesDecimals(a?: BigNumber.Value, decimals: string | number = 18) {
  if (!a) return ZERO;
  const bigA = ZERO.plus(a);
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) return bigA.times(decimals);
  return bigA.times(`1e${decimals}`);
}
