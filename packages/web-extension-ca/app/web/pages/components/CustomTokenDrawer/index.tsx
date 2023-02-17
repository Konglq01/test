import { AccountAssetItem, AccountAssets, TokenItemShowType } from '@portkey/types/types-ca/token';
import { DrawerProps } from 'antd';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAssetInfo, useTokenInfo, useUserInfo, useWalletInfo } from 'store/Provider/hooks';
import BaseDrawer from '../BaseDrawer';
import { fetchAssetAsync, fetchTokenListAsync } from '@portkey/store/store-ca/assets/slice';
import './index.less';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { ZERO } from '@portkey/constants/misc';
import { unitConverter } from '@portkey/utils/converter';
import { fetchAllTokenListAsync } from '@portkey/store/store-ca/tokenManagement/action';
import { useCaAddresses } from '@portkey/hooks/hooks-ca/wallet';
interface CustomSelectProps extends DrawerProps {
  // onChange?: (v: TokenBaseItemType) => void;
  onChange?: (v: AccountAssetItem, type: 'token' | 'nft') => void;
  onClose?: () => void;
  searchPlaceHolder?: string;
  drawerType: 'send' | 'receive';
}

export default function CustomTokenDrawer({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  drawerType,
  ...props
}: CustomSelectProps) {
  const { t } = useTranslation();
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'Testnet' : ''), [currentNetwork]);
  const { accountAssets, accountToken } = useAssetInfo();
  const { tokenDataShowInMarket } = useTokenInfo();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');
  const [assetList, setAssetList] = useState<TokenItemShowType[] | AccountAssets>([]);
  const appDispatch = useAppDispatch();
  const { passwordSeed } = useUserInfo();
  const caAddresses = useCaAddresses();

  useEffect(() => {
    if (drawerType === 'send') {
      setAssetList(accountAssets.accountAssetsList);
    } else {
      setAssetList(tokenDataShowInMarket);
    }
  }, [accountAssets.accountAssetsList, accountToken.accountTokenList, drawerType, tokenDataShowInMarket]);

  useEffect(() => {
    if (drawerType === 'send') {
      appDispatch(fetchAssetAsync({ caAddresses, keyword: filterWord }));
    } else {
      appDispatch(fetchAllTokenListAsync({ keyword: filterWord }));
    }
  }, [appDispatch, caAddresses, drawerType, filterWord]);

  useEffect(() => {
    if (drawerType === 'send') {
      passwordSeed && fetchAssetAsync({ caAddresses, keyword: filterWord });
    } else {
      passwordSeed && fetchTokenListAsync({ caAddresses });
    }
  }, [passwordSeed, filterWord, drawerType, caAddresses]);

  const renderToken = useCallback(
    (token: AccountAssetItem) => {
      return (
        <div className="item" key={token.symbol} onClick={onChange?.bind(undefined, token, 'token')}>
          <div className="icon">
            {token.symbol === 'ELF' ? (
              <CustomSvg type="Aelf" />
            ) : (
              <div className="custom">{token.symbol?.slice(0, 1)}</div>
            )}
          </div>
          <div className="info">
            <p className="symbol">{`${token.symbol}`}</p>
            <p className="network">
              {`${token.chainId.toLocaleLowerCase() === 'aelf' ? 'MainChain' : 'SideChain'} ${
                token.chainId
              } ${isTestNet}`}
            </p>
          </div>
          {drawerType === 'send' && (
            <div className="amount">
              <p className="quantity">
                {unitConverter(ZERO.plus(token?.tokenInfo?.balance || '').div(`1e${token?.tokenInfo?.decimal}`))}
              </p>
              <p className="convert">
                {isTestNet
                  ? ''
                  : `$ ${unitConverter(
                      ZERO.plus(token.tokenInfo?.balanceInUsd || '').div(`1e${token.tokenInfo?.decimal}`),
                    )}`}
              </p>
            </div>
          )}
        </div>
      );
    },
    [drawerType, isTestNet, onChange],
  );

  const renderNft = useCallback(
    (token: AccountAssetItem) => {
      return (
        <div className="item protocol" onClick={onChange?.bind(undefined, token, 'nft')}>
          <div className="avatar">{token.nftInfo?.imageUrl || token.nftInfo?.alias.slice(0, 1)}</div>
          <div className="info">
            <p className="alias">{token.nftInfo?.alias}</p>
            <p className="network">
              {`${token.chainId === 'AELF' ? 'MainChain' : 'SideChain'} ${token.chainId} ${isTestNet}`}
            </p>
          </div>
          <div className="amount">{token.nftInfo?.quantity}</div>
        </div>
      );
    },
    [isTestNet, onChange],
  );

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
        // onPressEnter={handleSearch}
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
          assetList.map((token: AccountAssetItem) => {
            return token.nftInfo ? renderNft(token) : renderToken(token);
          })
        )}
      </div>
    </BaseDrawer>
  );
}
