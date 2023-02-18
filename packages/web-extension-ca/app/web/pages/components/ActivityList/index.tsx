import { TransactionTypes, transactionTypesMap } from '@portkey/constants/constants-ca/activity';
import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { formatStr2EllipsisStr } from '@portkey/utils/converter';
import { List } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import moment from 'moment';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import './index.less';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { useIsTestnet } from 'hooks/useActivity';
import { formatAmount, transNetworkText } from '@portkey/utils/activity';

export interface IActivityListProps {
  data?: ActivityItemType[];
  hasMore: boolean;
  loadMore: (isRetry?: boolean) => Promise<void>;
}

export default function ActivityList({ data, hasMore, loadMore }: IActivityListProps) {
  const isTestNet = useIsTestnet();

  const activityListLeftIcon = (type: TransactionTypes) => {
    const loginRelatedTypeArr = [
      TransactionTypes.ADD_MANAGER,
      TransactionTypes.REMOVE_MANAGER,
      TransactionTypes.SOCIAL_RECOVERY,
    ];
    return loginRelatedTypeArr.includes(type) ? 'socialRecovery' : 'Transfer';
  };

  const nav = useNavigate();

  const navToDetail = useCallback(
    (item: ActivityItemType) => {
      nav('/transaction', { state: item });
    },
    [nav],
  );

  const amountOrIdUI = (item: ActivityItemType) => {
    const { transactionType, isReceived, amount, symbol, nftInfo, decimals } = item;

    return (
      <p className="row-1">
        <span>{transactionTypesMap(transactionType, nftInfo?.nftId)}</span>
        <span>
          <span>
            {nftInfo?.nftId && <span>#{nftInfo.nftId}</span>}
            {!nftInfo?.nftId && (
              <>
                {amount && <span>{isReceived ? '+' : '-'}</span>}
                <span>{`${formatAmount({ amount, decimals, digits: 4 })} ${symbol ?? ''}`}</span>
              </>
            )}
          </span>
        </span>
      </p>
    );
  };

  const fromAndUsdUI = useCallback(
    (item: ActivityItemType) => {
      const { isReceived, fromAddress, toAddress, priceInUsd, nftInfo } = item;
      const from = isReceived ? toAddress : fromAddress;

      return (
        <p className="row-2">
          <span>From: {formatStr2EllipsisStr(from, [7, 4])}</span>
          {nftInfo?.nftId && <span>{nftInfo.alias}</span>}
          {!isTestNet && !nftInfo?.nftId && (
            <span>$ {formatAmount({ amount: priceInUsd, decimals: 0, digits: 2 })}</span>
          )}
        </p>
      );
    },
    [isTestNet],
  );

  const networkUI = useCallback(
    (item: ActivityItemType) => {
      /* Hidden during [SocialRecovery, AddManager, RemoveManager] */
      const { transactionType, fromChainId, toChainId } = item;
      const from = transNetworkText(fromChainId, isTestNet);
      const to = transNetworkText(toChainId, isTestNet);
      const hiddenArr = [
        TransactionTypes.SOCIAL_RECOVERY,
        TransactionTypes.ADD_MANAGER,
        TransactionTypes.REMOVE_MANAGER,
      ];

      return !hiddenArr.includes(transactionType) && <p className="row-3">{`${from}->${to}`}</p>;
    },
    [isTestNet],
  );

  return (
    <div className="activity-list">
      <List>
        {data?.map((item, index) => (
          <List.Item key={`activityList_${item.transactionId}_${index}`}>
            <div className="activity-item" onClick={() => navToDetail(item)}>
              <div className="time">{moment(Number(item.timestamp)).format('MMM D [at] h:m a')}</div>
              <div className="info">
                <CustomSvg type={activityListLeftIcon(item.transactionType)} />
                <div className="right">
                  {amountOrIdUI(item)}
                  {fromAndUsdUI(item)}
                  {networkUI(item)}
                </div>
              </div>
            </div>
          </List.Item>
        ))}
      </List>
      <LoadingMore hasMore={hasMore} loadMore={loadMore} />
    </div>
  );
}
