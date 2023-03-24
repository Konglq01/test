import { NFT_SMALL_SIZE } from '@portkey-wallet/constants/constants-ca/assets';

export const getAWSUrlWithSize = (
  url: string = '',
  width: number = NFT_SMALL_SIZE,
  height: number = NFT_SMALL_SIZE,
) => {
  const sizeStr = `.com/${width}x${width}/`;
  const urlArr = url.split('.com/');
  return urlArr.join(sizeStr);
};
