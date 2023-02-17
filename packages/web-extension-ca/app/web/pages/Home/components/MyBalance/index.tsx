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
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { fetchAssetAsync, fetchTokenListAsync } from '@portkey/store/store-ca/assets/slice';
import { fetchAllTokenListAsync } from '@portkey/store/store-ca/tokenManagement/action';
import { TokenItemShowType } from '@portkey/types/types-eoa/token';

export interface TransactionResult {
  total: number;
  items: Transaction[];
}

let timer: any;

export default function MyBalance() {
  const { walletName, currentNetwork } = useWalletInfo();
  const { t } = useTranslation();
  const [balanceUSD, setBalanceUSD] = useState<string | number>('--');
  const [activeKey, setActiveKey] = useState<string>('assets');
  const [navTarget, setNavTarget] = useState<'send' | 'receive'>('send');
  const [tokenOpen, setTokenOpen] = useState(false);
  const {
    accountToken: { accountTokenList },
  } = useAssetInfo();
  const navigate = useNavigate();
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const {
    walletInfo: { caAddressList = [] },
  } = useCurrentWallet();

  useEffect(() => {
    console.log('---passwordSeed-myBalance---', passwordSeed);
    passwordSeed &&
      appDispatch(
        fetchAssetAsync({
          caAddresses: caAddressList,
          keyWord: '',
        }),
      );
    passwordSeed && appDispatch(fetchTokenListAsync({ caAddresses: caAddressList }));
    passwordSeed && appDispatch(fetchAllTokenListAsync({}));
  }, [passwordSeed, appDispatch, caAddressList]);

  useEffect(() => {
    let tmpAllBalanceUsd = 0;
    accountTokenList.forEach((item) => {
      tmpAllBalanceUsd += Number(item.balanceInUsd);
    });
    setBalanceUSD(tmpAllBalanceUsd + '');
  }, [accountTokenList]);

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
          // navigate(`/${navTarget}/${v.token.symbol}`);
          if (navTarget === 'receive') {
            navigate(`/${navTarget}/${v.symbol}/${v.chainId}`);
          } else {
            navigate(`/${navTarget}/${v.symbol}`, { state: type });
          }
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
        {currentNetwork === 'MAIN' ? (
          <span className="amount">$ {unitConverter(balanceUSD)}</span>
        ) : (
          <span className="dev-mode amount">Dev Mode</span>
        )}
      </div>
      <BalanceCard
        amount={balanceUSD}
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
            children: <Activity loading={false} />,
          },
        ]}
      />
    </div>
  );
}
