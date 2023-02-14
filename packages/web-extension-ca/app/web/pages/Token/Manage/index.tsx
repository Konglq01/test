import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, message } from 'antd';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useToken } from '@portkey/hooks/hooks-ca/useToken';
import { UserTokenItemType } from '@portkey/types/types-ca/token';
import { filterTokenList } from '@portkey/utils/extension/token-ca';
import DropdownSearch from 'components/DropdownSearch';
import { useTranslation } from 'react-i18next';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useUserInfo } from 'store/Provider/hooks';
import './index.less';

export default function AddToken() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { networkType } = useCurrentNetworkInfo();
  const [tokenState, tokenActions] = useToken();
  const { tokenDataShowInMarket } = tokenState;
  const { fetchTokenList, displayUserToken } = tokenActions;
  const [filterWord, setFilterWord] = useState<string>('');
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [tokenList, setTokenList] = useState<UserTokenItemType[]>([]);
  const [topTokenList, setTopTokenList] = useState<UserTokenItemType[]>([]);
  const { passwordSeed } = useUserInfo();

  useEffect(() => {
    passwordSeed && fetchTokenList({ pageSize: 1000, pageNo: 1 });
  }, [passwordSeed]);

  useEffect(() => {
    const allTokenList = filterTokenList(tokenDataShowInMarket, filterWord);

    if (filterWord) setOpenDrop(!allTokenList.length);

    const topTokenList: UserTokenItemType[] = [];
    const _tokenList: UserTokenItemType[] = [];
    allTokenList.forEach((item) => {
      if (item.isDefault) topTokenList.push(item);
      else _tokenList.push(item);
    });
    setTopTokenList(topTokenList);
    setTokenList(_tokenList);
  }, [tokenDataShowInMarket, filterWord]);

  const rightElement = useMemo(() => <CustomSvg type="Close2" onClick={() => navigate(-1)} />, [navigate]);

  const handleUserTokenDisplay = useCallback(
    (item: UserTokenItemType) => {
      try {
        displayUserToken(item);
        message.success('success');
      } catch (error: any) {
        message.error('display error');
        console.log('=== userToken display', error);
      }
    },
    [displayUserToken],
  );

  const renderTokenItem = useCallback(
    (item: UserTokenItemType) => {
      const { isDefault = false, isDisplay = true } = item;
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
            handleUserTokenDisplay(item);
          }}>
          {t(isDisplay ? 'Hide' : 'Add')}
        </Button>
      );
    },
    [handleUserTokenDisplay, t],
  );

  const renderList = useCallback(
    (item: UserTokenItemType) => (
      <div className="token-item" key={item.token.symbol}>
        <div className="token-item-content">
          {item.token.symbol === 'ELF' ? (
            <CustomSvg className="token-logo" type="Aelf" />
          ) : (
            <div className="token-logo custom-word-logo">{(item.token.symbol && item.token.symbol[0]) || ''}</div>
          )}
          <p className="token-info">
            <span className="token-item-symbol">{item.token.symbol}</span>
            <span className="token-item-net">
              {`${item.token.chainId === 'AELF' ? 'MainChain' : 'SideChain'} ${item.token.chainId} ${networkType}`}
            </span>
          </p>
        </div>
        <div className="token-item-action">{renderTokenItem(item)}</div>
      </div>
    ),
    [networkType, renderTokenItem],
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
