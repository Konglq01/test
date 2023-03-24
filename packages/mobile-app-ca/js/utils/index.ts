import dayjs from 'dayjs';

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

export function compareVersions(v1: string, v2: string) {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    if (v1Part < v2Part) {
      return -1;
    } else if (v1Part > v2Part) {
      return 1;
    }
  }
  return 0;
}
