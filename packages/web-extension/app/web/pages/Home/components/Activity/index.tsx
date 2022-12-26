import { ZERO } from '@portkey/constants/misc';
import { useCurrentNetwork } from '@portkey/hooks/network';
import { unitConverter } from '@portkey/utils/converter';
import { List } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { useAppSelector, useCommonState } from 'store/Provider/hooks';
import checkMain from 'utils/util.isMain';
import { Transaction } from '../MyBalance';
import TransactionDetail from '../TransactionDetail';

export interface ActivityProps {
  data?: any[];
  total?: number;
  rate: any;
  loading: boolean;
  appendData: Function;
  clearData: Function;
}

export enum EmptyTipMessage {
  NO_TRANSACTIONS = 'You have no transactions',
  NETWORK_NO_TRANSACTIONS = 'No transaction records accessible from the current custom network',
}

export default function Activity({ data = [], total, loading, rate, appendData, clearData }: ActivityProps) {
  const { t } = useTranslation();
  const [, setDetail] = useLocalStorage<Transaction>('TransactionDetail');
  const currentNetwork = useCurrentNetwork();
  const { currentAccount } = useAppSelector((state) => state.wallet);
  const [transactionInfo, setTransactionInfo] = useState<Transaction>();
  const { isPrompt } = useCommonState();
  const { isCustom, blockExplorerURL, nativeCurrency, netWorkType, chainId } = currentNetwork;
  const isMain = checkMain(netWorkType, chainId);
  const nav = useNavigate();
  let ticking = false;

  const handleSeeDetail = useCallback(
    (detail: Transaction) => {
      if (isPrompt) {
        setDetail(detail);
        nav('/transaction-detail');
      } else {
        setTransactionInfo(detail);
      }
    },
    [isPrompt, nav, setDetail],
  );

  useEffect(() => {
    clearData();
    appendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockExplorerURL, currentAccount?.address]);

  useEffectOnce(() => {
    const root = document.querySelector('#root');
    root?.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (root.clientHeight === root.scrollHeight - root.scrollTop) {
            if (!loading) {
              appendData();
            }
          }
          ticking = false;
        });

        ticking = true;
      }
    });
  });

  return (
    <div className="activity-wrapper">
      <TransactionDetail rate={rate} info={transactionInfo} onClose={setTransactionInfo.bind(undefined, undefined)} />
      {isCustom ? (
        <p className="empty">{t(EmptyTipMessage.NETWORK_NO_TRANSACTIONS)}</p>
      ) : total ? (
        <List split={false}>
          {data.map((item: Transaction) => {
            return (
              <List.Item key={item.tx_id} onClick={() => handleSeeDetail(item)}>
                <div className="tx-card" style={{ height: 90 }}>
                  <div className="left">
                    <CustomSvg type={item.method === 'Transfer' ? 'Transfer' : 'Transaction'} />
                    <div className="info">
                      <p className="method">{item.method}</p>
                      <p className="status">{t('Success')}</p>
                    </div>
                  </div>
                  <div className="right">
                    <p className="balance">
                      {`${unitConverter(
                        ZERO.plus(item?.quantity ?? 0).div(Math.pow(10, nativeCurrency?.decimals || 8)),
                      )} ELF`}
                    </p>

                    <p className="convert">
                      {isMain &&
                        `$${unitConverter(
                          ZERO.plus(item?.quantity ?? 0)
                            ?.div(Math.pow(10, nativeCurrency?.decimals || 8))
                            ?.multipliedBy(rate?.USDT || 0),
                        )} USD`}
                    </p>
                  </div>
                </div>
              </List.Item>
            );
          })}
        </List>
      ) : (
        <p className="empty">{t(EmptyTipMessage.NO_TRANSACTIONS)}</p>
      )}
    </div>
  );
}
