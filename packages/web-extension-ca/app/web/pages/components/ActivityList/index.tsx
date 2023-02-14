import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { Transaction } from '@portkey/types/types-ca/trade';
import { DotLoading, InfiniteScroll, List } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export interface IActivityListProps {
  data?: ActivityItemType[];
  hasMore: boolean;
  loadMore: (isRetry: boolean) => Promise<void>;
}

export default function ActivityList({ data, hasMore, loadMore }: IActivityListProps) {
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'TESTNET' : ''), [currentNetwork]);
  const nav = useNavigate();

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
    (item: ActivityItemType) => {
      nav('/transaction', { state: { info: item } });
    },
    [nav],
  );

  return (
    <div className="activity-list">
      <List>
        {data?.map((item, index) => (
          <List.Item key={`${item.transactionId}_${index}`}>
            <div className="activity-item" onClick={() => navToDetail(item)}>
              <div className="time">{moment(Number(item.timestamp)).format('MMM D [at] h:m a')}</div>
              <div className="info">
                <CustomSvg type="Transfer" />
                <div className="right">
                  <p className="row-1">
                    <span>{item.transactionType}</span>
                    <span>
                      +{item.amount} {item.symbol}
                    </span>
                  </p>
                  <p className="row-2">
                    <span>From: {item.fromaddress.replace(/(?<=^\w{7})\w*(?=\w{4}$)/, '...')}</span>
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
