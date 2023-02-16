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
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { MINUTE } from '@portkey/constants';
import { useEffectOnce } from 'react-use';
import NFT from '../NFT/NFT';
import { unitConverter } from '@portkey/utils/converter';
import { useAppDispatch, useUserInfo, useWalletInfo, useAssetInfo } from 'store/Provider/hooks';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { fetchAssetAsync } from '@portkey/store/store-ca/assets/slice';

export interface TransactionResult {
  total: number;
  items: Transaction[];
}

let timer: any;

const mockData: { items: TokenItemShowType[]; totalCount: number } = {
  items: [],
  totalCount: 2,
};

export default function MyBalance() {
  const { walletName, currentNetwork } = useWalletInfo();
  const { t } = useTranslation();
  const [balanceUSD, setBalanceUSD] = useState<string | number>('--');
  const [activeKey, setActiveKey] = useState<string>('assets');
  const [navTarget, setNavTarget] = useState<'send' | 'receive'>();
  const [tokenOpen, setTokenOpen] = useState(false);
  const [tokenList, setTokenList] = useState<any[]>([]);
  const { accountAssets } = useAssetInfo();
  const navigate = useNavigate();
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const {
    walletInfo: { caAddressList },
  } = useCurrentWallet();

  useEffect(() => {
    passwordSeed &&
      appDispatch(
        fetchAssetAsync({
          caAddresses: caAddressList || [],
          keyWord: '',
        }),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordSeed]);

  console.log('---accountAssets', accountAssets);

  const [tokenNum, setTokenNumber] = useState(0);

  const [refreshing, setRefreshing] = useState(false);

  // TODO Waiting for interface
  const getAccountTokenList = useCallback(() => {
    const timer: any = setTimeout(() => {
      setTokenList(mockData?.items ?? []);
      setTokenNumber(mockData?.totalCount ?? 0);
      setRefreshing(false);
      return clearTimeout(timer);
    }, 1000);
  }, []);

  useEffectOnce(() => {
    getAccountTokenList();
  });
  // get account balance
  const getAccountBalance = useCallback(async () => {
    //TODO fetchBalance
    const fetchBalance = (): Promise<number | string> =>
      new Promise((resolve) => {
        setTimeout(() => {
          return resolve('100.00');
        }, 1000);
      });
    const result = await fetchBalance();
    setBalanceUSD(result);
  }, []);

  // get account Balance
  const initAccountBalance = useCallback(() => {
    if (timer) clearInterval(timer);
    getAccountBalance();
    timer = setInterval(() => {
      getAccountBalance();
    }, 6 * MINUTE);
  }, [getAccountBalance]);

  useEffectOnce(() => {
    initAccountBalance();
  });

  useEffect(() => () => clearInterval(timer), []);

  const SelectTokenELe = useMemo(() => {
    return (
      <CustomTokenDrawer
        drawerType="send"
        open={tokenOpen}
        title={navTarget === 'receive' ? 'Select Token' : 'Select Assets'}
        searchPlaceHolder={navTarget === 'receive' ? 'Search Token' : 'Search Assets'}
        height="528"
        maskClosable={true}
        placement="bottom"
        onClose={() => setTokenOpen(false)}
        onChange={(v) => {
          setTokenOpen(false);
          // navigate(`/${navTarget}/${v.token.symbol}`);
          if (navTarget === 'receive') {
            navigate(`/${navTarget}/${v.symbol}/${v.chainId}`);
          } else {
            navigate(`/${navTarget}/${v.symbol}`);
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
          // setNavTarget('send');
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
            children: <TokenList tokenList={tokenList} />,
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
