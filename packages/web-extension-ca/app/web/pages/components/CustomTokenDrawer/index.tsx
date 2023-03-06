import { AccountAssetItem, AccountAssets, TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { DrawerProps } from 'antd';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAssetInfo, useTokenInfo, useUserInfo, useWalletInfo } from 'store/Provider/hooks';
import BaseDrawer from '../BaseDrawer';
import { fetchAssetAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import './index.less';
import { divDecimals, unitConverter } from '@portkey-wallet/utils/converter';
import { useCaAddresses, useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchAllTokenListAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
interface CustomSelectProps extends DrawerProps {
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
  const { accountAssets } = useAssetInfo();
  const { tokenDataShowInMarket } = useTokenInfo();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');
  const [assetList, setAssetList] = useState<TokenItemShowType[] | AccountAssets>([]);
  const appDispatch = useAppDispatch();
  const { passwordSeed } = useUserInfo();
  const caAddresses = useCaAddresses();
  const chainIdArray = useChainIdList();
  const symbolImages = useSymbolImages();

  useEffect(() => {
    if (drawerType === 'send') {
      setAssetList(accountAssets.accountAssetsList);
    } else {
      setAssetList(tokenDataShowInMarket);
    }
  }, [accountAssets.accountAssetsList, drawerType, tokenDataShowInMarket]);

  useEffect(() => {
    if (!passwordSeed) return;
    if (drawerType === 'send') {
      appDispatch(fetchAssetAsync({ caAddresses, keyword: filterWord }));
    } else {
      appDispatch(fetchAllTokenListAsync({ chainIdArray, keyword: filterWord }));
    }
  }, [passwordSeed, filterWord, drawerType, caAddresses, appDispatch, chainIdArray]);

  const renderSendToken = useCallback(
    (token: AccountAssetItem) => {
      return (
        <div
          className="item"
          key={`${token.symbol}_${token.chainId}`}
          onClick={onChange?.bind(undefined, token, 'token')}>
          <div className="icon">
            <div className="custom">
              {symbolImages[token.symbol] ? <img src={symbolImages[token.symbol]} /> : token?.symbol?.slice(0, 1)}
            </div>
          </div>
          <div className="info">
            <p className="symbol">{`${token.symbol}`}</p>
            <p className="network">
              {`${token.chainId === 'AELF' ? 'MainChain' : 'SideChain'} ${token.chainId} ${isTestNet}`}
            </p>
          </div>
          <div className="amount">
            <p className="quantity">
              {unitConverter(divDecimals(token.tokenInfo?.balance, token.tokenInfo?.decimals))}
            </p>
            <p className="convert">
              {isTestNet
                ? ''
                : `$ ${unitConverter(divDecimals(token.tokenInfo?.balanceInUsd, token.tokenInfo?.decimals))}`}
            </p>
          </div>
        </div>
      );
    },
    [isTestNet, onChange, symbolImages],
  );

  const renderReceiveToken = useCallback(
    (token: TokenItemShowType) => {
      const tokenTmp: AccountAssetItem = {
        chainId: token.chainId,
        symbol: token.symbol,
        address: token.address,
        tokenInfo: {
          id: token.id || '',
          balance: token.balance,
          decimals: token.decimals + '' || '8',
          balanceInUsd: token.balanceInUsd,
          tokenContractAddress: token.address,
        },
      };
      return (
        <div
          className="item"
          key={`${token.symbol}_${token.chainId}`}
          onClick={onChange?.bind(undefined, tokenTmp, 'token')}>
          <div className="icon">
            <div className="custom">
              {symbolImages[token.symbol] ? <img src={symbolImages[token.symbol]} /> : token?.symbol?.slice(0, 1)}
            </div>
          </div>
          <div className="info">
            <p className="symbol">{`${token.symbol}`}</p>
            <p className="network">
              {`${token.chainId === 'AELF' ? 'MainChain' : 'SideChain'} ${token.chainId} ${isTestNet}`}
            </p>
          </div>
        </div>
      );
    },
    [isTestNet, onChange, symbolImages],
  );

  const renderNft = useCallback(
    (token: AccountAssetItem) => {
      return (
        <div
          key={`${token.nftInfo?.alias}_${token.nftInfo?.tokenId}`}
          className="item protocol"
          onClick={onChange?.bind(undefined, token, 'nft')}>
          <div className="avatar">
            {token.nftInfo?.imageUrl ? <img src={token.nftInfo.imageUrl} /> : token.nftInfo?.alias?.slice(0, 1)}
          </div>
          <div className="info">
            <p className="alias">{`${token.nftInfo?.alias} #${token.nftInfo?.tokenId}`}</p>
            <p className="network">
              {`${token.chainId === 'AELF' ? 'MainChain' : 'SideChain'} ${token.chainId} ${isTestNet}`}
            </p>
          </div>
          <div className="amount">{token.nftInfo?.balance}</div>
        </div>
      );
    },
    [isTestNet, onChange],
  );

  const handleClose = useCallback(() => {
    setFilterWord('');
    onClose?.();
  }, [onClose]);

  return (
    <BaseDrawer {...props} onClose={handleClose} className="change-token-drawer">
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
          assetList.map((token: TokenItemShowType | AccountAssetItem) => {
            if (drawerType === 'send') {
              return (token as AccountAssetItem).nftInfo?.tokenId ? renderNft(token) : renderSendToken(token);
            } else {
              return renderReceiveToken(token as TokenItemShowType);
            }
          })
        )}
      </div>
    </BaseDrawer>
  );
}
