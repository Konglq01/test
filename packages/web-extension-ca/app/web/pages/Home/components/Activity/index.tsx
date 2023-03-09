import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import ActivityList from 'pages/components/ActivityList';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useUserInfo } from 'store/Provider/hooks';
import { transactionTypesForActivityList } from '@portkey-wallet/constants/constants-ca/activity';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { clearActivity } from '@portkey-wallet/store/store-ca/activity/slice';

export interface ActivityProps {
  appendData?: Function;
  clearData?: Function;
  chainId?: string;
  symbol?: string;
}

export enum EmptyTipMessage {
  NO_TRANSACTIONS = 'You have no transactions',
  NETWORK_NO_TRANSACTIONS = 'No transaction records accessible from the current custom network',
}

const AMX_RESULT_COUNT = 10;
const SKIP_COUNT = 0;

export default function Activity({ chainId, symbol }: ActivityProps) {
  const { t } = useTranslation();
  const activity = useAppCASelector((state) => state.activity);
  const activityMapKey = () => {
    if (!chainId && !symbol) {
      return 'TOTAL';
    } else {
      return `${chainId}_${symbol}`;
    }
  };
  const currentActivity = activity.activityMap[activityMapKey()];

  const dispatch = useAppCommonDispatch();
  const { passwordSeed } = useUserInfo();
  const currentWallet = useCurrentWallet();
  const {
    walletInfo: { caAddressList },
  } = currentWallet;

  useEffect(() => {
    if (passwordSeed) {
      const params: IActivitiesApiParams = {
        maxResultCount: AMX_RESULT_COUNT,
        skipCount: SKIP_COUNT,
        caAddresses: caAddressList,
        chainId: chainId,
        symbol: symbol,
        transactionTypes: transactionTypesForActivityList,
      };
      dispatch(getActivityListAsync(params));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordSeed]);

  const loadMoreActivities = useCallback(() => {
    const { data, maxResultCount, skipCount, totalRecordCount } = currentActivity;
    if (data.length < totalRecordCount) {
      const params = {
        maxResultCount: AMX_RESULT_COUNT,
        skipCount: skipCount + maxResultCount,
        caAddresses: caAddressList,
        chainId: chainId,
        symbol: symbol,
        transactionTypes: transactionTypesForActivityList,
      };
      return dispatch(getActivityListAsync(params));
    }
  }, [currentActivity, caAddressList, chainId, dispatch, symbol]);

  return (
    <div className="activity-wrapper">
      {currentActivity.totalRecordCount ? (
        <ActivityList
          data={currentActivity.data}
          chainId={chainId}
          hasMore={currentActivity.data.length < currentActivity.totalRecordCount}
          loadMore={loadMoreActivities}
        />
      ) : (
        <p className="empty">{t(EmptyTipMessage.NO_TRANSACTIONS)}</p>
      )}
    </div>
  );
}
