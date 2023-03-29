import { request } from '@portkey-wallet/api/api-did';
import { CryptoInfoType, OrderQuoteType } from '../type';

export const fetchOrderQuote = async (params: {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount: string;
  side: string;
}) => {
  const rst = await request.payment.fetchOrderQuote({
    params: {
      ...params,
      type: 'ONE',
    },
  });
  if (rst.returnCode !== '0000') {
    throw new Error(rst.returnMsg);
  }
  return rst.data as OrderQuoteType;
};

export const getCryptoInfo = async (params: { fiat: string }, symbol: string, chainId: string) => {
  const rst = await request.payment.getCryptoList({
    params,
  });
  if (rst.returnCode !== '0000') {
    throw new Error(rst.returnMsg);
  }
  return (rst.data as CryptoInfoType[]).find((item: any) => item.symbol === symbol && item.chainId === chainId);
};
