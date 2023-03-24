import { NFT_SMALL_SIZE } from '@portkey-wallet/constants/constants-ca/assets';

export const getAWSUrlWithSize = (
  url: string = '',
  width: number = NFT_SMALL_SIZE,
  height: number = NFT_SMALL_SIZE,
) => {
  const sizeStr = `${width}x${height}`;
  const urlArr = url.split('/');
  const len = urlArr.length;
  return urlArr
    .slice(0, len - 1)
    .concat([sizeStr])
    .concat(urlArr[len - 1])
    .join('/');
};
