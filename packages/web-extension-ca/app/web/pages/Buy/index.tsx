import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, message, Radio, RadioChangeEvent } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import CustomDrawer from './components/CustomDrawer';
import { IconType } from 'types/icon';
import { handleKeyDown } from 'utils/keyDown';
import './index.less';

export enum DrawerType {
  token,
  currency,
}

enum PageType {
  buy,
  sell,
}

type InputValue = {
  value: string;
  target: string;
};

const initInput: InputValue = {
  value: '',
  target: '',
};
const initToken = {
  code: 'ELF',
  icon: 'Aelf',
};

const initCurrency = {
  code: 'USD',
  icon: 'Aelf',
};

export default function Buy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<PageType>(PageType.buy);
  const [drawerType, setDrawerType] = useState<DrawerType>(DrawerType.currency);
  const [inputValue, setInputValue] = useState<InputValue>(initInput);
  const [curToken, setCurToken] = useState({ code: 'ELF', icon: 'Aelf' });
  const [curCurrency, setCurCurrency] = useState({ code: 'USD', icon: 'Aelf' });
  const label = useMemo(() => (page === PageType.buy ? 'pay' : 'sell'), [page]);
  const disabled = useMemo(() => inputValue.value === '', [inputValue.value]);

  const handleInputChange = useCallback((value: string) => {
    const target = '';
    setInputValue({ value, target });
  }, []);

  const handlePageChange = useCallback((e: RadioChangeEvent) => {
    setInputValue(initInput);
    setCurCurrency(initCurrency);
    setCurToken(initToken);
    setPage(e.target.value);
  }, []);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleNext = useCallback(() => {
    // TODO limit
    // setErrMsg('');
    navigate('/buy/preview');
  }, [navigate]);

  const handleSelect = useCallback(
    (v: { code: string; icon: string }) => {
      if (drawerType === DrawerType.token) {
        setCurToken(v);
      } else {
        setCurCurrency(v);
      }
    },
    [drawerType],
  );

  const SelectELe = useMemo(() => {
    const title = drawerType === DrawerType.token ? 'Select Token' : 'Select Currency';
    const searchPlaceHolder = drawerType === DrawerType.token ? 'Search Token' : 'Search Currency';
    return (
      <CustomDrawer
        open={open}
        drawerType={drawerType}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        height="528"
        maskClosable={true}
        placement="bottom"
        onClose={() => setOpen(false)}
        onChange={handleSelect}
      />
    );
  }, [drawerType, handleSelect, open]);

  const renderTokenInput = useMemo(() => {
    return (
      <Input
        type="text"
        value={page === PageType.sell ? inputValue.value : inputValue.target}
        autoComplete="off"
        readOnly={page === PageType.buy}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="0"
        suffix={
          <>
            <CustomSvg type={curToken.icon as IconType} />
            <div className="currency">{curToken.code}</div>
            <CustomSvg
              type="Down"
              onClick={() => {
                setDrawerType(DrawerType.token);
                setOpen(true);
              }}
            />
          </>
        }
      />
    );
  }, [curToken.code, curToken.icon, handleInputChange, inputValue.target, inputValue.value, page]);

  const renderCurrencyInput = useMemo(() => {
    return (
      <Input
        value={page === PageType.sell ? inputValue.target : inputValue.value}
        autoComplete="off"
        onChange={(e) => handleInputChange(e.target.value)}
        readOnly={page === PageType.sell}
        onKeyDown={handleKeyDown}
        placeholder="0"
        suffix={
          <>
            <CustomSvg type={curCurrency.icon as IconType} />
            <div className="currency">{curCurrency.code}</div>
            <CustomSvg
              type="Down"
              onClick={() => {
                setDrawerType(DrawerType.currency);
                setOpen(true);
              }}
            />
          </>
        }
      />
    );
  }, [curCurrency.code, curCurrency.icon, handleInputChange, inputValue.target, inputValue.value, page]);

  return (
    <div className="buy-frame">
      <div className="buy-title">
        <BackHeader
          title={t('Buy')}
          leftCallBack={handleBack}
          rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
        />
      </div>
      <div className="buy-content flex-column-center">
        <div className="buy-radio">
          <Radio.Group defaultValue={PageType.buy} buttonStyle="solid" onChange={handlePageChange}>
            <Radio.Button value={PageType.buy}>{PageType[PageType.buy]}</Radio.Button>
            <Radio.Button value={PageType.sell}>{PageType[PageType.sell]}</Radio.Button>
          </Radio.Group>
        </div>
        <div className="buy-input">
          <div className="label">{`I want to ${label}`}</div>
          {page === PageType.buy ? renderCurrencyInput : renderTokenInput}
          {!!errMsg && <div className="error-text">{errMsg}</div>}
        </div>
        <div className="buy-input">
          <div className="label">I will receive≈</div>
          {page === PageType.sell ? renderCurrencyInput : renderTokenInput}
        </div>
        <div className="buy-rate flex-between-center">
          <div>1 ELF = 0.3333 USD</div>
          <div className="timer flex-center">
            <CustomSvg type="Timer" />
            <div className="timestamp">6s</div>
          </div>
        </div>
      </div>
      <div className="buy-footer">
        <Button type="primary" htmlType="submit" disabled={disabled} onClick={handleNext}>
          {t('Next')}
        </Button>
      </div>
      {SelectELe}
    </div>
  );
}
