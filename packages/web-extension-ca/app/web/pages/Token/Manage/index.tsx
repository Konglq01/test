import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, message } from 'antd';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useToken } from '@portkey/hooks/hooks-ca/useToken';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import DropdownSearch from 'components/DropdownSearch';
import { useTranslation } from 'react-i18next';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useAppDispatch, useTokenInfo, useUserInfo } from 'store/Provider/hooks';

import './index.less';
import { fetchAllTokenListAsync } from '@portkey/store/store-ca/tokenManagement/action';

export default function AddToken() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { networkType } = useCurrentNetworkInfo();
  const [_, tokenActions] = useToken();
  const { tokenDataShowInMarket } = useTokenInfo();
  const { displayUserToken } = tokenActions;
  const [filterWord, setFilterWord] = useState<string>('');
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    passwordSeed && appDispatch(fetchAllTokenListAsync({ keyword: filterWord }));
  }, [passwordSeed, filterWord, appDispatch]);

  useEffect(() => {
    tokenDataShowInMarket.length ? setOpenDrop(false) : setOpenDrop(true);
  }, [tokenDataShowInMarket]);

  const rightElement = useMemo(() => <CustomSvg type="Close2" onClick={() => navigate(-1)} />, [navigate]);

  const handleUserTokenDisplay = useCallback(
    async (item: TokenItemShowType) => {
      try {
        await displayUserToken(item);
        message.success('success');
      } catch (error: any) {
        message.error('display error');
        console.log('=== userToken display', error);
      }
    },
    [displayUserToken],
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
            handleUserTokenDisplay(item);
          }}>
          {t(isAdded ? 'Hide' : 'Add')}
        </Button>
      );
    },
    [handleUserTokenDisplay, t],
  );

  const renderList = useCallback(
    (item: TokenItemShowType) => (
      <div className="token-item" key={`${item.symbol}-${item.chainId}`}>
        <div className="token-item-content">
          {item.symbol === 'ELF' ? (
            <CustomSvg className="token-logo" type="Aelf" />
          ) : (
            <div className="token-logo custom-word-logo">{(item.symbol && item.symbol[0]) || ''}</div>
          )}
          <p className="token-info">
            <span className="token-item-symbol">{item.symbol}</span>
            <span className="token-item-net">
              {`${item.chainId === 'AELF' ? 'MainChain' : 'SideChain'} ${item.chainId} ${networkType}`}
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
              if (filterWord && !tokenDataShowInMarket.length) setOpenDrop(true);
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
      {!!tokenDataShowInMarket.length && (
        <div className="add-token-content">{tokenDataShowInMarket.map((item) => renderList(item))}</div>
      )}
      {/* {filterWord && !tokenDataShowInMarket.length && (
        <div className="flex-center fix-max-content add-token-content-empty">{t('There is no search result.')}</div>
      )} */}
    </div>
  );
}
