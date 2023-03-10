import { CountryItem } from '../index';
import countryCodeMap from './countryCodeList.json';

export const countryCodeList = countryCodeMap.countryCode;

export const getCountryCodeJSON = (countryCode: CountryItem[]) => {
  const country: { [x: string]: any[] } = {};
  countryCode.forEach(item => {
    const first = item.country[0];
    if (country[first]) country[first].push(item);
    else country[first] = [item];
  });
  return country;
};

export const countryCodeIndex = (countryCode: CountryItem[]) => {
  return Object.entries(getCountryCodeJSON(countryCode));
};
