import { CountryItem } from '@portkey-wallet/types/types-ca/payment';
import countryCodeMapJson from './countryCodeList.json';

const getCountryCodeMap = (list: CountryItem[]) => {
  const country: { [key: string]: CountryItem } = {};
  list.forEach(item => {
    country[item.iso] = item;
  });
  return country;
};

export const countryCodeList = countryCodeMapJson.countryCode;

export const countryCodeMap = getCountryCodeMap(countryCodeList);

export const DefaultCountry: CountryItem = {
  country: 'United States',
  iso: 'US',
  icon: 'https://static.alchemypay.org/alchemypay/flag/US.png',
};
