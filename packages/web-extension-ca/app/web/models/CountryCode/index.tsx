import CommonModal from 'components/CommonModal';
import { useAppDispatch, useCustomModal } from 'store/Provider/hooks';
import { setCountryModal } from 'store/reducers/modal/slice';
import { Button, IndexBar, List } from 'antd-mobile';
import countryCodeIndex from '@portkey-wallet/constants/constants-ca/countryCode/countryCodeIndex.json';
import { countryCodeList } from '@portkey-wallet/constants/constants-ca/countryCode';

import { CountryItem } from '@portkey-wallet/constants/constants-ca';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import './index.less';
import BackHeader from 'components/BackHeader';
import { useTranslation } from 'react-i18next';
import CustomSvg from 'components/CustomSvg';
import { Input } from 'antd';

export default function CountryCode() {
  const { countryCodeModal } = useCustomModal();
  const dispatch = useAppDispatch();
  const [searchVal, setSearchVal] = useState<string>();
  const { t } = useTranslation();
  const timer = useRef<any>(null);

  const filterList = useMemo(
    () => countryCodeList.filter((country) => country.country.toLocaleLowerCase() === searchVal?.toLocaleLowerCase()),
    [searchVal],
  );

  const debounce = useCallback((fn: () => void, delay = 500) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(function () {
      fn();
    }, delay);
  }, []);

  const onSearchCountry = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.trim();
      debounce(() => setSearchVal(val));
    },
    [debounce],
  );

  const AllCountry = useMemo(
    () => (
      <IndexBar>
        {(countryCodeIndex as [string, CountryItem[]][]).map(([index, countries]) => {
          return (
            <IndexBar.Panel
              className={!countries.length && !searchVal ? 'country-empty' : ''}
              index={index}
              title={index}
              key={index}>
              {countries.map((item) => (
                <div
                  key={`${item.code}_${item.country}`}
                  onClick={() => {
                    // navigate('/setting/countries/view', { state: { ...item, index: index } });
                  }}>
                  <div className="flex-between-center country-item-content">
                    <span className="country-item-name">{item.country}</span>
                    <div className="flex-center country-index-code">{item.code}</div>
                  </div>
                </div>
              ))}
            </IndexBar.Panel>
          );
        })}
      </IndexBar>
    ),
    [searchVal],
  );

  const filterCountry = useMemo(
    () => filterList.map((item) => <div key={item.code}>{item.country}</div>),
    [filterList],
  );

  return (
    <CommonModal
      className="country-code-modal"
      closable={false}
      open={countryCodeModal}
      onCancel={() => dispatch(setCountryModal(false))}>
      <div className="flex-column country-title">
        <BackHeader
          title={t('Select country/region')}
          leftCallBack={() => {
            //
          }}
          rightElement={<></>}
        />
        <Input
          className="search-input"
          prefix={<CustomSvg type="SearchBlur" className="search-svg" />}
          placeholder="Search countries and region"
          onChange={onSearchCountry}
        />
      </div>
      {searchVal ? filterCountry : AllCountry}
    </CommonModal>
  );
}
