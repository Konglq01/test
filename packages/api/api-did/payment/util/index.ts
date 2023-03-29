import { request } from '@portkey-wallet/api/api-did';
import { OrderQuoteType } from '../type';

export const fetchOrderQuote = async (params: {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount: string;
  payWayCode: string;
  side: string;
}) => {
  const rst = await request.payment.fetchOrderQuote({
    params,
  });
  if (rst.returnCode !== '0000') {
    throw new Error(rst.returnMsg);
  }
  return rst.data as OrderQuoteType[];
};
