import { CountryItem } from '../index';
import countryCodeMap from './countryCodeList.json';

export const getCountryCodeJSON = (countryCode: CountryItem[]) => {
  const country: { [x: string]: CountryItem[] } = {};
  countryCode.forEach(item => {
    const first = item.country[0];
    if (country[first]) country[first].push(item);
    else country[first] = [item];
  });
  return country;
};

export const getCountryCodeIndex = (countryCode: CountryItem[]) => {
  return Object.entries(getCountryCodeJSON(countryCode));
};

export const countryCodeList = countryCodeMap.countryCode;

export const countryCode = getCountryCodeJSON(countryCodeList);

export const countryCodeIndex = getCountryCodeIndex(countryCodeList);

export const countryCodeFilter = (filterFelid: string) => {
  filterFelid = filterFelid.toLocaleLowerCase();
  if (/\d/.test(filterFelid)) {
    return countryCodeList.filter(country => country.code.includes(filterFelid));
  } else {
    return countryCodeList.filter(country => country.country.toLocaleLowerCase().includes(filterFelid));
  }
};
