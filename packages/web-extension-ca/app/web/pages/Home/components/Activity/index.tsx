import { useAppCASelector, useAppCommonDispatch } from '@portkey/hooks';
import { clearState } from '@portkey/store/store-ca/activity/slice';
import ActivityList from 'pages/components/ActivityList';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivityListAsync } from '@portkey/store/store-ca/activity/action';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { useUserInfo } from 'store/Provider/hooks';
import { transactionTypesForActivityList } from '@portkey/constants/constants-ca/activity';
import { IActivitysApiParams } from '@portkey/store/store-ca/activity/type';

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

export default function Activity({ appendData, clearData, chainId, symbol }: ActivityProps) {
  const { t } = useTranslation();
  const activity = useAppCASelector((state) => state.activity);

  const dispatch = useAppCommonDispatch();
  const { passwordSeed } = useUserInfo();
  const currentWallet = useCurrentWallet();
  const {
    walletInfo: { caAddressList },
  } = currentWallet;

  useEffect(() => {
    if (passwordSeed) {
      // We need to get the activities of the current network
      // If you want to get the latest data, please dispatch(clearState()) first
      dispatch(clearState());

      const params: IActivitysApiParams = {
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

  useEffect(() => {
    clearData?.();
    appendData?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMoreActivities = useCallback(() => {
    const { data, maxResultCount, skipCount, totalRecordCount } = activity;
    if (data.length < totalRecordCount) {
      const params = {
        maxResultCount: AMX_RESULT_COUNT,
        skipCount: skipCount + maxResultCount,
        caAddresses: caAddressList,
      };
      return dispatch(getActivityListAsync(params));
    }
  }, [activity, caAddressList, dispatch]);

  return (
    <div className="activity-wrapper">
      {activity.totalRecordCount ? (
        <ActivityList
          data={activity.data}
          hasMore={activity.data.length < activity.totalRecordCount}
          loadMore={loadMoreActivities}
        />
      ) : (
        <p className="empty">{t(EmptyTipMessage.NO_TRANSACTIONS)}</p>
      )}
    </div>
  );
}
