import { useCallback, useEffect, useMemo, useState } from 'react';
import { SandboxErrorCode } from 'service/SandboxEventService';
import { useAppDispatch, useAppSelector, useCommonState } from 'store/Provider/hooks';
import { ZERO } from '@portkey-wallet/constants/misc';
import { Tabs } from 'antd';
import { useCurrentAccountTokenList } from '@portkey-wallet/hooks/hooks-eoa/useToken';
import { useNavigate } from 'react-router';
import { updateBalance } from '@portkey-wallet/store/tokenBalance/slice';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import './index.less';
import { useGetELFRateQuery } from '@portkey-wallet/store/rate/api';
import BalanceCard from 'pages/components/BalanceCard';
import Activity from '../Activity';
import Assets from '../Assets';
import CustomTokenDrawer from 'pages/components/CustomTokenDrawer';
import CustomTokenModal from 'pages/components/CustomTokenModal';
import { useTranslation } from 'react-i18next';

export interface Transaction {
  id: number;
  tx_id: string;
  params_to: string;
  chain_id: string;
  block_height: number;
  address_from: string;
  address_to: string;
  params: string;
  method: string;
  block_hash: string;
  tx_fee: string;
  resources: string;
  quantity: number;
  tx_status: string;
  time: string;
}

export interface TransactionResult {
  total: number;
  transactions: Transaction[];
}

export default function MyBalance() {
  const { t } = useTranslation();
  const { isPrompt } = useCommonState();
  const [activeKey, setActiveKey] = useState<string>('assets');
  const [pageIndex, setPageIndex] = useState(-1);
  const [txData, setTxData] = useState<Transaction[]>([]);
  const [tokenOpen, setTokenOpen] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [totalTx, setTotalTx] = useState(0);
  const { currentChain } = useAppSelector((state) => state.chain);
  const { currentAccount } = useAppSelector((state) => state.wallet);
  const { balances } = useAppSelector((state) => state.tokenBalance);
  const { data: rate } = useGetELFRateQuery({}, { pollingInterval: 1000 * 60 * 60 });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const tokenList = useCurrentAccountTokenList();

  const nativeBalance = useMemo(
    () =>
      balances?.[currentChain.rpcUrl]?.[currentAccount?.address ?? '']?.[currentChain.nativeCurrency?.symbol ?? 'ELF'],
    [balances, currentAccount?.address, currentChain.nativeCurrency?.symbol, currentChain.rpcUrl],
  );

  const SelectTokenELe = useMemo(() => {
    if (isPrompt) {
      return (
        <CustomTokenModal
          open={tokenOpen}
          onClose={() => setTokenOpen(false)}
          selectList={tokenList}
          onChange={(v) => {
            setTokenOpen(false);
            navigate(`/send/${v.symbol}/${v.address}`);
          }}
        />
      );
    }
    return (
      <CustomTokenDrawer
        open={tokenOpen}
        height="528"
        maskClosable={true}
        placement="bottom"
        onClose={() => setTokenOpen(false)}
        selectList={tokenList}
        onChange={(v) => {
          setTokenOpen(false);
          navigate(`/send/${v.symbol}/${v.address}`);
        }}
      />
    );
  }, [isPrompt, navigate, tokenList, tokenOpen]);

  const _getBalance = useCallback(async () => {
    try {
      if (!currentAccount?.address) return;
      const balanceMessage = await getBalance({
        account: currentAccount?.address,
        tokenList,
        currentChain,
      });
      if (balanceMessage.code === SandboxErrorCode.error) {
        console.log(balanceMessage, '_getBalance==');
        return;
      }
      console.log(balanceMessage.result, ' balanceMessage.result ');
      balanceMessage.result && dispatch(updateBalance(balanceMessage.result));
    } catch (error) {
      console.log(error);
    }
  }, [currentAccount, currentChain, dispatch, tokenList]);

  useEffect(() => {
    _getBalance();
  }, [_getBalance]);

  const onChange = useCallback(async (key: string) => {
    setActiveKey(key);
  }, []);

  const appendData = useCallback(() => {
    if (currentChain?.blockExplorerURL && pageIndex >= 0 && (!totalTx || totalTx > pageIndex * 10)) {
      setTxLoading(true);
      fetch(
        `${currentChain?.blockExplorerURL}${
          currentChain?.blockExplorerURL.slice(-1) === '/' ? '' : '/'
        }api/address/transactions?address=${currentAccount?.address}&limit=10&page=${pageIndex}`,
      )
        .then((res) => res.json())
        .then((body: TransactionResult) => {
          setTxLoading(false);
          setTxData((v) => v.concat(body.transactions.filter((item) => item.tx_status === 'MINED')));
          setTotalTx(body.total);
        });
    }
  }, [currentAccount?.address, currentChain?.blockExplorerURL, pageIndex, totalTx]);

  const handleClearData = useCallback(() => {
    setTotalTx(0);
    setTxData([]);
    setPageIndex(-1);
  }, []);

  useEffect(() => {
    appendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  return (
    <div className="balance">
      <BalanceCard
        amount={ZERO.plus(nativeBalance ?? 0).div(Math.pow(10, currentChain.nativeCurrency?.decimals || 8))}
        symbol={currentChain?.nativeCurrency?.symbol || 'ELF'}
        onSend={() => {
          if (tokenList.length > 1) {
            return setTokenOpen(true);
          }
          navigate(`/send/${currentChain?.nativeCurrency?.symbol ?? 'ELF'}/${currentChain?.nativeCurrency?.address}`);
        }}
        onReceive={() => navigate('/receive')}
      />
      {SelectTokenELe}
      <Tabs
        accessKey={activeKey}
        onChange={onChange}
        centered
        items={[
          {
            label: t('Assets'),
            key: 'assets',
            children: <Assets tokenList={tokenList} rate={rate} />,
          },
          {
            label: t('Activity'),
            key: 'activity',
            children: (
              <Activity
                loading={txLoading}
                data={txData}
                total={totalTx}
                rate={rate}
                appendData={() => {
                  setTimeout(() => {
                    setPageIndex((v) => ++v);
                  }, 100);
                }}
                clearData={handleClearData}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
