import dayjs from 'dayjs';

/**
 * this function is to format address,just like "formatStr2EllipsisStr" ---> "for...ess"
 * @param address
 * @param digit
 * @param type
 * @returns
 */
export const formatStr2EllipsisStr = (address = '', digit = 10, type: 'middle' | 'tail' = 'middle'): string => {
  if (!address) return '';

  const len = address.length;

  if (type === 'tail') return `${address.slice(0, digit)}...`;

  if (len < 2 * digit) return address;
  const pre = address.substring(0, digit);
  const suffix = address.substring(len - digit - 1);
  return `${pre}...${suffix}`;
};

/**
 * timestamp to formatted time like 'Nov 10 at 1:09 pm', if last year format to "2020 Nov 10 at 1:09 pm "
 * @param time
 * @returns
 */

// TODO cn zh
export const formatTransferTime = (time: string | number) => {
  if (dayjs(time).isBefore(dayjs(), 'year')) {
    return dayjs(time).format('YYYY MMM D , h:mm a').replace(',', 'at');
  }

  return dayjs(time).format('MMM D , h:mm a').replace(',', 'at');
};

/**
 * "aelf:ELF_xxx_AELF" to "ELF_xxx_AELF"
 * @param address
 * @returns
 */
export const formatAddress2NoPrefix = (address: string): string => {
  if (address.match(/^aelf:.+/)) {
    return address.split(':')[1];
  }
  return address;
};

/**
 * format information like "MainChain AELF"
 * @param chainId
 * @returns
 */
export const formatChainInfo = (chainId: 'AELF' | 'tDVV' | 'tDVW' = 'AELF'): string => {
  return `${chainId === 'AELF' ? 'MainChain' : 'SideChain'} ${chainId}`;
};
