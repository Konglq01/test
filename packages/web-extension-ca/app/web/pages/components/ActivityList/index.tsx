import { Transaction } from '@portkey/types/types-ca/trade';
import { DotLoading, InfiniteScroll, List } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export default function ActivityList({
  hasMore,
  loadMore,
}: {
  hasMore: boolean;
  loadMore: (isRetry: boolean) => Promise<void>;
}) {
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'TESTNET' : ''), [currentNetwork]);
  const nav = useNavigate();
  const data: Transaction[] = [
    {
      chainId: '123123',
      token: { symbol: 'ELF', address: 'adasdasdaqea' },
      method: 'Transfer',
      from: '0xawe123eeafadafdawe',
      to: '0xawe123eeafadafdawe',
      transactionId: 'asdasdabkhk',
      amount: '123',
      timestamp: '1670660449961',
      priceInUsd: '10',
    },
    {
      chainId: '123123',
      token: { symbol: 'ELF', address: 'adasdasdaqea' },
      method: 'Transfer',
      from: '0xawe123eeafadafdawe',
      to: '0xawe123eeafadafdawe',
      transactionId: 'asdasdabkhk',
      amount: '123',
      timestamp: '1670660449961',
      priceInUsd: '10',
    },
  ];
  const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <span>Loading</span>
            <DotLoading />
          </>
        ) : (
          <span>No Data</span>
        )}
      </>
    );
  };

  const navToDetail = useCallback(
    (item: Transaction) => {
      nav('/transaction', { state: { info: item } });
    },
    [nav],
  );

  return (
    <div className="activity-list">
      <List>
        {data.map((item, index) => (
          <List.Item key={`${item.transactionId}_${index}`}>
            <div className="activity-item" onClick={() => navToDetail(item)}>
              <div className="time">{moment(Number(item.timestamp)).format('MMM D [at] h:m a')}</div>
              <div className="info">
                <CustomSvg type="Transfer" />
                <div className="right">
                  <p className="row-1">
                    <span>{item.method}</span>
                    <span>
                      +{item.amount} {item.token.symbol}
                    </span>
                  </p>
                  <p className="row-2">
                    <span>From: {item.from.replace(/(?<=^\w{7})\w*(?=\w{4}$)/, '...')}</span>
                    <span>${item.priceInUsd}</span>
                  </p>
                  {/* TODO Hidden during Social Recovery  */}
                  {<p className="row-3">{`MainChain AELF ${isTestNet} -> MainChain AELF ${isTestNet}`}</p>}
                </div>
              </div>
            </div>
          </List.Item>
        ))}
      </List>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
        <InfiniteScrollContent hasMore={hasMore} />
      </InfiniteScroll>
    </div>
  );
}
