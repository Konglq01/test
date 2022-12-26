import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useNavigate } from 'react-router';
import { Button } from 'antd';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useToken } from '@portkey/hooks/hooks-ca/useToken';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { filterTokenList } from '@portkey/utils/extension/token-ca';
import './index.less';
import DropdownSearch from 'components/DropdownSearch';
import { useTranslation } from 'react-i18next';

export default function AddToken() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tokenState, tokenActions] = useToken();
  const { tokenDataShowInMarket } = tokenState;
  const { fetchTokenList, addToken, deleteToken } = tokenActions;
  const [filterWord, setFilterWord] = useState<string>('');
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [tokenList, setTokenList] = useState<TokenItemShowType[]>([]);
  const [topTokenList, setTopTokenList] = useState<TokenItemShowType[]>([]);

  useEffectOnce(() => {
    if (tokenDataShowInMarket?.length) return;
    fetchTokenList({ pageSize: 10000, pageNo: 1 });
  });

  useEffect(() => {
    const allTokenList = filterTokenList(tokenDataShowInMarket, filterWord);

    if (filterWord) setOpenDrop(!allTokenList.length);
    allTokenList.sort((a, b) => a.symbol.localeCompare(b.symbol));

    const topTokenList: TokenItemShowType[] = [];
    const _tokenList: TokenItemShowType[] = [];
    allTokenList.forEach((item) => {
      if (item.symbol === 'ELF') topTokenList.push(item);
      else _tokenList.push(item);
    });
    setTopTokenList(topTokenList);
    setTokenList(_tokenList);
  }, [tokenDataShowInMarket, filterWord]);

  const rightElement = useMemo(
    () => <CustomSvg type="Close2" onClick={() => navigate(-1)} style={{ width: 18, height: 18 }} />,
    [navigate],
  );

  const renderTokenItem = useCallback(
    (item: TokenItemShowType) => {
      const { isDefault = false, isAdded = true } = item;
      if (isDefault) {
        return (
          <span className="add-token-btn-icon">
            <CustomSvg type="GaryLock" />
          </span>
        );
      }

      return (
        <Button
          className="add-token-btn"
          onClick={() => {
            if (isAdded) deleteToken(item);
            else addToken(item);
          }}>
          {t(isAdded ? 'Hide' : 'Add')}
        </Button>
      );
    },
    [addToken, deleteToken, t],
  );

  const renderList = useCallback(
    (item: TokenItemShowType) => (
      <div className="token-item" key={item.symbol}>
        <div className="token-item-content">
          {item.symbol === 'ELF' ? (
            <CustomSvg className="token-logo" type="Aelf" style={{ width: 28, height: 28 }} />
          ) : (
            <div className="token-logo custom-word-logo">{(item.symbol && item.symbol[0]) || ''}</div>
          )}
          <p className="token-info">
            <span className="token-item-symbol">{item.symbol}</span>
            <span className="token-item-net">MainChain AELF Testnet</span>
          </p>
        </div>
        <div className="token-item-action">{renderTokenItem(item)}</div>
      </div>
    ),
    [renderTokenItem],
  );

  return (
    <div className="add-token">
      <div className="add-token-top">
        <SettingHeader title={t('Add tokens')} leftCallBack={() => navigate(-1)} rightElement={rightElement} />
        <DropdownSearch
          overlayClassName="empty-dropdown"
          open={openDrop}
          overlay={<div className="empty-tip">{t('There is no search result.')}</div>}
          value={filterWord}
          inputProps={{
            onBlur: () => setOpenDrop(false),
            onFocus: () => {
              if (filterWord && !tokenList.length) setOpenDrop(true);
            },
            onChange: (e) => {
              const _value = e.target.value.replaceAll(' ', '');
              if (!_value) setOpenDrop(false);

              setFilterWord(_value);
            },
            placeholder: 'Search token',
          }}
        />
      </div>
      <div className="add-token-content">
        {topTokenList?.map((item) => renderList(item))}
        {tokenList?.map((item) => renderList(item))}
      </div>
    </div>
  );
}
