import { CountryItem } from '@portkey-wallet/constants/constants-ca';
import { countryCodeFilter, countryCodeList } from '@portkey-wallet/constants/constants-ca/countryCode';
import { Input } from 'antd';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { ChangeEvent, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './index.less';

interface AreaCodeProps {
  open?: boolean;
  value?: CountryItem['country'];
  onCancel?: () => void;
  onChange?: (item: CountryItem) => void;
}

export default function AreaCode({ open, value, onChange, onCancel }: AreaCodeProps) {
  const [searchVal, setSearchVal] = useState<string>('');

  const timer = useRef<any>(null);

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

  useEffect(() => {
    if (!open) return;
    const listener = () => onCancel?.();
    window.addEventListener('click', listener);
    return () => {
      window.removeEventListener('click', listener);
    };
  }, [onCancel, open]);

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const item = useCallback(
    (countryItem: CountryItem) => (
      <li
        key={countryItem.country}
        className={clsx('flex-between-center area-code-item', value === countryItem.country && 'active-item')}
        onClick={() => onChange?.(countryItem)}>
        <span>{countryItem.country}</span>
        <span>+ {countryItem.code}</span>
      </li>
    ),
    [onChange, value],
  );

  const allList = useMemo(() => countryCodeList.map((country) => item(country)), [item]);

  const noDate = useMemo(() => <div className="flex-center no-search-result">There is no search result.</div>, []);

  const filterList = useMemo(() => {
    const list = countryCodeFilter(searchVal);
    if (!list.length) return noDate;
    return list.map((country) => item(country));
  }, [item, noDate, searchVal]);

  return (
    <div className="area-code-wrapper" id="area-code" style={{ display: open ? 'flex' : 'none' }} onClick={onClick}>
      <div className="input-wrapper">
        <Input
          className="clear-input-border search-input"
          prefix={<CustomSvg type="SearchBlur" className="search-svg" />}
          placeholder="Search"
          onChange={onSearchCountry}
        />
      </div>
      <ul className="area-code-content">{!searchVal ? allList : filterList}</ul>
    </div>
  );
}
