import useToken from '@portkey/hooks/hooks-ca/useToken';
import { UserTokenItemType } from '@portkey/types/types-ca/token';
import { filterTokenList } from '@portkey/utils/extension/token-ca';
import { DrawerProps } from 'antd';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserInfo, useWalletInfo } from 'store/Provider/hooks';
import BaseDrawer from '../BaseDrawer';
import './index.less';

interface CustomSelectProps extends DrawerProps {
  // onChange?: (v: TokenBaseItemType) => void;
  onChange?: (v: UserTokenItemType) => void;
  onClose?: () => void;
  searchPlaceHolder?: string;
}

export default function CustomTokenDrawer({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  ...props
}: CustomSelectProps) {
  const { t } = useTranslation();
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? currentNetwork : ''), [currentNetwork]);
  const [tokenState, { fetchTokenList }] = useToken();
  const { tokenDataShowInMarket } = tokenState;
  const [tokenList, setTokenList] = useState<UserTokenItemType[]>([]);
  const [topTokenList, setTopTokenList] = useState<UserTokenItemType[]>([]);
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');
  const { passwordSeed } = useUserInfo();

  const assetList = useMemo(() => [...topTokenList, ...tokenList], [tokenList, topTokenList]);
  // const assetList = useMemo(() => [], [tokenList, topTokenList]);

  const handleSearch = useCallback(() => {
    // TODO search
  }, []);

  useEffect(() => {
    if (tokenDataShowInMarket?.length) return;
    // TODO Need nft list and search interface
    passwordSeed && fetchTokenList({ pageSize: 1000, pageNo: 1 });
  }, [passwordSeed]);

  useEffect(() => {
    // const allTokenList = filterTokenList(tokenDataShowInMarket, filterWord);
    const allTokenList = filterTokenList(tokenDataShowInMarket, '');

    // if (filterWord) setOpenDrop(!allTokenList.length)
    allTokenList.sort((a, b) => a.token.symbol.localeCompare(b.token.symbol));

    const topTokenList: UserTokenItemType[] = [];
    const _tokenList: UserTokenItemType[] = [];
    allTokenList.forEach((item) => {
      if (item.token.symbol === 'ELF') topTokenList.push(item);
      else _tokenList.push(item);
    });
    setTopTokenList(topTokenList);
    setTokenList(_tokenList);
  }, [tokenDataShowInMarket]);

  return (
    <BaseDrawer {...props} onClose={onClose} className="change-token-drawer">
      <div className="header">
        <p>{title || 'Select Assets'}</p>
        <CustomSvg
          type="Close2"
          onClick={() => {
            onClose?.();
          }}
        />
      </div>
      <DropdownSearch
        overlayClassName="empty-dropdown"
        open={openDrop}
        value={filterWord}
        overlay={<div className="empty-tip">{t('There is no search result.')}</div>}
        onPressEnter={handleSearch}
        inputProps={{
          onBlur: () => setOpenDrop(false),
          // onFocus: () => {
          // if (filterWord && !tokenDataShowInMarket.length) setOpenDrop(true);
          // },
          onChange: (e) => {
            const _value = e.target.value.replaceAll(' ', '');
            if (!_value) setOpenDrop(false);

            setFilterWord(_value);
          },
          placeholder: searchPlaceHolder || 'Search Assets',
        }}
      />
      <div className="list">
        {assetList.length === 0 ? (
          <div className="empty-content">
            <p className="empty-text">
              {filterWord.length === 0 ? 'There are currently no assets to send' : 'There is no search result'}
            </p>
          </div>
        ) : (
          assetList.map((token: UserTokenItemType) => (
            <div className="item" key={token.token.symbol} onClick={onChange?.bind(undefined, token)}>
              <div className="icon">
                {token.token.symbol === 'ELF' ? (
                  <CustomSvg type="Aelf" />
                ) : (
                  <div className="custom">{token.token.symbol?.slice(0, 1)}</div>
                )}
              </div>
              <div className="info">
                <p className="symbol">{`${token.token.symbol}`}</p>
                <p className="network">MainChain AELF {isTestNet}</p>
              </div>
              <div className="amount">
                <p className="quantity">321.12</p>
                <p className="convert">{isTestNet ? '' : `$23.34`}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </BaseDrawer>
  );
}
