import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsTestnet } from 'hooks/useNetwork';
import { DrawerType } from '../../index';
import './index.less';

export interface ICustomTokenListProps {
  onChange?: (v: { code: string; icon: string }) => void;
  onClose?: () => void;
  title?: ReactNode;
  searchPlaceHolder?: string;
  drawerType: DrawerType;
}

const currencyList = [
  {
    code: 'USD',
    icon: 'Aelf',
  },
  {
    code: 'SGD',
    icon: 'Aelf',
  },
  {
    code: 'HKD',
    icon: 'Aelf',
  },
  {
    code: 'CNY',
    icon: 'Aelf',
  },
];

const tokenList = [
  {
    symbol: 'ELF',
    chainId: 'AELF',
  },
];

export default function CustomTokenList({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  drawerType,
}: ICustomTokenListProps) {
  const { t } = useTranslation();
  const isTestNet = useIsTestnet();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');

  const renderCurrencyList = useMemo(
    () => (
      <>
        {currencyList.map((currency) => (
          <div
            key={currency.code}
            className="item currency-item flex"
            onClick={() => {
              onChange?.(currency);
              onClose?.();
            }}>
            <CustomSvg className="token-logo" type="Aelf" />
            <div className="text">{currency.code}</div>
          </div>
        ))}
      </>
    ),
    [onChange, onClose],
  );

  const renderTokenList = useMemo(
    () => (
      <>
        {tokenList.map((token) => (
          <div
            key={token.symbol}
            className="item token-item flex"
            onClick={() => {
              onChange?.({ code: 'ELF', icon: 'Aelf' });
              onClose?.();
            }}>
            <CustomSvg type="Aelf" />
            <div className="flex-column text">
              <div>{token.symbol}</div>
              <div className="chain">MainChain AELF</div>
            </div>
          </div>
        ))}
      </>
    ),
    [onChange, onClose],
  );

  return (
    <div className="custom-list">
      <div className="header">
        <p>{title || 'Select Assets'}</p>
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <DropdownSearch
        overlayClassName="empty-dropdown"
        open={openDrop}
        value={filterWord}
        overlay={<div className="empty-tip">{t('There is no search result.')}</div>}
        inputProps={{
          onBlur: () => setOpenDrop(false),
          onChange: (e) => {
            const _value = e.target.value.replaceAll(' ', '');
            if (!_value) setOpenDrop(false);

            setFilterWord(_value);
          },
          placeholder: searchPlaceHolder || 'Search Assets',
        }}
      />
      <div className="list">{drawerType === DrawerType.currency ? renderCurrencyList : renderTokenList}</div>
    </div>
  );
}
