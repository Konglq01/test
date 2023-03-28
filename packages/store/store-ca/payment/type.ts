export interface FiatType {
  currency: string; // 3 letters fiat code
  country: string; // 2 letters region code
  payWayCode: string; // code of payment
  payWayName: string; // name of payment
  fixedFee: number; // ramp flat rate
  rateFee: number; // ramp percentage rate
  payMin: number;
  payMax: number;
}

export interface PaymentStateType {
  fiatList: FiatType[];
}
