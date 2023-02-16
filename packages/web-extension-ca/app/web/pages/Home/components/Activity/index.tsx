import { useAppCASelector, useAppCommonDispatch } from '@portkey/hooks';
import { clearState } from '@portkey/store/store-ca/activity/slice';
import ActivityList from 'pages/components/ActivityList';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import { getActivityListAsync } from '@portkey/store/store-ca/activity/action';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { useUserInfo } from 'store/Provider/hooks';
import { transactionTypesForActivityList } from '@portkey/constants/constants-ca/activity';
import { IActivitysApiParams } from '@portkey/store/store-ca/activity/type';

export interface ActivityProps {
  total?: number;
  rate: any;
  loading: boolean;
  appendData?: Function;
  clearData?: Function;
}

export enum EmptyTipMessage {
  NO_TRANSACTIONS = 'You have no transactions',
  NETWORK_NO_TRANSACTIONS = 'No transaction records accessible from the current custom network',
}

export default function Activity({ loading, appendData, clearData }: ActivityProps) {
  const { t } = useTranslation();
  const activity = useAppCASelector((state) => state.activity);
  const dispatch = useAppCommonDispatch();
  const { passwordSeed } = useUserInfo();
  const currentWallet = useCurrentWallet();
  const {
    walletInfo: { caAddressList, address },
  } = currentWallet;
  let ticking = false;

  useEffect(() => {
    if (passwordSeed) {
      // We need to get the activities of the current network
      // If you want to get the latest data, please dispatch(clearState()) first
      dispatch(clearState());

      const params: IActivitysApiParams = {
        maxResultCount: 10,
        skipCount: 0,
        caAddresses: caAddressList,
        // managerAddresses: address,
        transactionTypes: transactionTypesForActivityList,
      };
      dispatch(getActivityListAsync(params));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordSeed]);

  const handleScroll: EventListener = (event) => {
    const target = event.target as Element;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (target) {
          if (target.clientHeight === target.scrollHeight - target.scrollTop) {
            if (!loading) {
              // TODO page change
              // dispatch(getActivityListAsync({ type: 'MAIN' }));
            }
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  useEffect(() => {
    clearData?.();
    appendData?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectOnce(() => {
    const root = document.querySelector('#root');
    root?.addEventListener('scroll', handleScroll);
    return root?.removeEventListener('scroll', handleScroll);
  });

  function loadMoreActivities(): void {
    if (activity.data.length < activity.totalRecordCount) {
      const params = {
        maxResultCount: 10,
        skipCount: activity.skipCount + activity.maxResultCount,
        caAddresses: caAddressList,
      };
      dispatch(getActivityListAsync(params));
    }
  }

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
