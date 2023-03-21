import { useCallback, useEffect, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import { useNavigate } from 'react-router';
import './index.less';
import BalanceCard from 'pages/components/BalanceCard';
import CustomTokenDrawer from 'pages/components/CustomTokenDrawer';
import { useTranslation } from 'react-i18next';
import TokenList from '../Tokens';
import Activity from '../Activity/index';
import { Transaction } from '@portkey-wallet/types/types-ca/trade';
import NFT from '../NFT/NFT';
import { fixedDecimal } from '@portkey-wallet/utils/converter';
import { useAppDispatch, useUserInfo, useWalletInfo, useAssetInfo } from 'store/Provider/hooks';
import { useCaAddresses, useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { fetchAllTokenListAsync, getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { getWalletNameAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useIsTestnet } from 'hooks/useNetwork';

export interface TransactionResult {
  total: number;
  items: Transaction[];
}

// let timer: any;

export default function MyBalance() {
  const { walletName } = useWalletInfo();
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<string>('assets');
  const [navTarget, setNavTarget] = useState<'send' | 'receive'>('send');
  const [tokenOpen, setTokenOpen] = useState(false);
  const {
    accountToken: { accountTokenList },
    accountBalance,
  } = useAssetInfo();
  const navigate = useNavigate();
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const caAddresses = useCaAddresses();
  const chainIdArray = useChainIdList();
  const isTestNet = useIsTestnet();
  const renderTabsData = useMemo(
    () => [
      {
        label: t('Tokens'),
        key: 'tokens',
        children: <TokenList tokenList={accountTokenList} />,
      },
      {
        label: t('NFTs'),
        key: 'nft',
        children: <NFT />,
      },
      {
        label: t('Activity'),
        key: 'activity',
        children: <Activity />,
      },
    ],
    [accountTokenList, t],
  );

  useEffect(() => {
    console.log('---passwordSeed-myBalance---', passwordSeed);
    if (!passwordSeed) return;
    appDispatch(fetchTokenListAsync({ caAddresses }));
    appDispatch(fetchAllTokenListAsync({ keyword: '', chainIdArray }));
    appDispatch(getWalletNameAsync());
    appDispatch(getSymbolImagesAsync());
  }, [passwordSeed, appDispatch, caAddresses, chainIdArray]);

  // useEffect(() => {
  //   console.log('accountTokenList', accountTokenList, timer);
  //   if (accountTokenList.length > 0) return clearInterval(timer);
  //   if (timer) clearInterval(timer);
  //   timer = setInterval(() => {
  //     if (accountTokenList.length > 0) return clearInterval(timer);
  //     appDispatch(fetchTokenListAsync({ caAddresses }));
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, [accountTokenList, appDispatch, caAddresses, passwordSeed]);

  const SelectTokenELe = useMemo(() => {
    return (
      <CustomTokenDrawer
        drawerType={navTarget}
        open={tokenOpen}
        title={navTarget === 'receive' ? 'Select Token' : 'Select Assets'}
        searchPlaceHolder={navTarget === 'receive' ? 'Search Token' : 'Search Assets'}
        height="528"
        maskClosable={true}
        placement="bottom"
        onClose={() => setTokenOpen(false)}
        onChange={(v, type) => {
          setTokenOpen(false);
          const state = {
            chainId: v.chainId,
            decimals: type === 'nft' ? 0 : v.tokenInfo?.decimals,
            address: type === 'nft' ? v?.nftInfo?.tokenContractAddress : v?.tokenInfo?.tokenContractAddress,
            symbol: v.symbol,
            name: v.symbol,
            imageUrl: type === 'nft' ? v.nftInfo?.imageUrl : '',
            alias: type === 'nft' ? v.nftInfo?.alias : '',
            tokenId: type === 'nft' ? v.nftInfo?.tokenId : '',
          };
          navigate(`/${navTarget}/${type}/${v.symbol}`, { state });
        }}
      />
    );
  }, [navTarget, navigate, tokenOpen]);

  const onChange = useCallback(async (key: string) => {
    setActiveKey(key);
  }, []);

  return (
    <div className="balance">
      <div className="wallet-name">{walletName}</div>
      <div className="balance-amount">
        {isTestNet ? (
          <span className="dev-mode amount">Dev Mode</span>
        ) : (
          <span className="amount">$ {fixedDecimal(accountBalance, 2)}</span>
        )}
      </div>
      <BalanceCard
        amount={accountBalance}
        onSend={() => {
          setNavTarget('send');
          return setTokenOpen(true);
        }}
        onReceive={() => {
          setNavTarget('receive');
          return setTokenOpen(true);
        }}
      />
      {SelectTokenELe}
      <Tabs accessKey={activeKey} onChange={onChange} centered items={renderTabsData} />
    </div>
  );
}
