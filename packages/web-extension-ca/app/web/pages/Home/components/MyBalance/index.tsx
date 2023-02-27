import { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Tabs } from 'antd';
import { useNavigate } from 'react-router';
import './index.less';
import BalanceCard from 'pages/components/BalanceCard';
import CustomTokenDrawer from 'pages/components/CustomTokenDrawer';
import { useTranslation } from 'react-i18next';
import TokenList from '../Tokens';
import Activity from '../Activity/index';
import { Transaction } from '@portkey/types/types-ca/trade';
import NFT from '../NFT/NFT';
import { unitConverter } from '@portkey/utils/converter';
import { useAppDispatch, useUserInfo, useWalletInfo, useAssetInfo, useTokenInfo } from 'store/Provider/hooks';
import { useCaAddresses, useChainIdList, useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { fetchAssetAsync, fetchTokenListAsync } from '@portkey/store/store-ca/assets/slice';
import { fetchAllTokenListAsync, getSymbolImagesAsync } from '@portkey/store/store-ca/tokenManagement/action';
import { TokenItemShowType } from '@portkey/types/types-eoa/token';
import { getWalletNameAsync } from '@portkey/store/store-ca/wallet/actions';

export interface TransactionResult {
  total: number;
  items: Transaction[];
}

let timer: any;

export default function MyBalance() {
  const { walletName, currentNetwork, walletInfo } = useWalletInfo();
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<string>('assets');
  const [navTarget, setNavTarget] = useState<'send' | 'receive'>('send');
  const [tokenOpen, setTokenOpen] = useState(false);
  const {
    accountToken: { accountTokenList },
    accountBalance,
    accountAssets: { accountAssetsList },
  } = useAssetInfo();
  const navigate = useNavigate();
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const caAddresses = useCaAddresses();
  const chainIdArray = useChainIdList();
  const isMain = useMemo(() => currentNetwork === 'MAIN', [currentNetwork]);

  useEffect(() => {
    console.log('---passwordSeed-myBalance---', passwordSeed);
    if (!passwordSeed) return;
    // appDispatch(
    //   fetchAssetAsync({
    //     caAddresses,
    //     keyword: '',
    //   }),
    // );
    appDispatch(fetchTokenListAsync({ caAddresses }));
    appDispatch(fetchAllTokenListAsync({ keyword: '', chainIdArray }));
    appDispatch(getWalletNameAsync());
    appDispatch(getSymbolImagesAsync());
  }, [passwordSeed, appDispatch, caAddresses, chainIdArray]);

  useEffect(() => () => clearInterval(timer), []);

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
          navigate(`/${navTarget}/${type}/${v.symbol}/${v.chainId}`, { state });
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
        {isMain ? (
          <span className="amount">$ {unitConverter(accountBalance)}</span>
        ) : (
          <span className="dev-mode amount">Dev Mode</span>
        )}
      </div>
      <BalanceCard
        amount={accountBalance}
        onSend={() => {
          // if (tokenList.length > 1) {
          setNavTarget('send');
          return setTokenOpen(true);
          // }
          // navigate(`/send/${'ELF'}`);
        }}
        onReceive={() => {
          // if (tokenList.length > 1) {
          setNavTarget('receive');
          return setTokenOpen(true);
          // }
          // navigate('/receive');
        }}
      />
      {SelectTokenELe}
      <Tabs
        accessKey={activeKey}
        onChange={onChange}
        centered
        items={[
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
        ]}
      />
    </div>
  );
}
