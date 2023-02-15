import { useAppCASelector, useAppCommonDispatch } from '@portkey/hooks';
import { clearState } from '@portkey/store/store-ca/activity/slice';
import { Transaction } from '@portkey/types/types-ca/trade';
import ActivityList from 'pages/components/ActivityList';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import { useWalletInfo } from 'store/Provider/hooks';
import { getActivityAsync, getActivityListAsync } from '@portkey/store/store-ca/activity/action';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { transactionTypes } from '@portkey/constants/constants-ca/activity';
import { ActivityStateType } from '@portkey/store/store-ca/activity/type';

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
  // const { currentNetwork } = useWalletInfo();
  // TODO use this selector to get data
  const activity = useAppCASelector((state) => state.activity);
  const dispatch = useAppCommonDispatch();
  const currentWallet = useCurrentWallet();
  const {
    walletInfo: { caAddressList },
  } = currentWallet;
  let ticking = false;

  useEffectOnce(() => {
    // TODO We need to get the activities of the current network
    // TODO If you want to get the latest data, please dispatch(clearState()) first
    dispatch(clearState());

    const params = {
      maxResultCount: 75,
      skipCount: 0,
      // caAddresses: caAddressList,
      // transactionTypes: transactionTypes,
      // chainId: 'AELF',
      // symbol: 'ELF',
    };
    dispatch(getActivityListAsync(params));
    // SocialRecovery
    const param = {
      transactionId: 'c4188ecc0a6386459d35a31784520e8d4d2f6498eaca29ad19b91933154e67bb',
      blockHash: '9abfaddc92de68ad65d3144f9566b4f17d39681b7d4d647341a87531b330e7a3',
    };
    // Transfer
    const param2 = {
      transactionId: '85eb6220df7f1dfc3e5de10daaff8c1445fd1cc8acfcc1e69b3beaa55d478975',
      blockHash: '4b9062ca30dcaae193c015a0c15c6d4dc289758f51cd3d5d4402a5be16085a12',
    };

    // CrossChainTransfer
    const param3 = {
      transactionId: '6e97e9a6a4885b3d9603a24a9446a14c02c202dc51384f2e1806bafe2b5fbf4e',
      blockHash: '10eef2daf3e506e5abe7f73952d94d4b661cc410bf5384c1290e5dbbddc99831',
    };
    // CrossChainReceiveToken
    const param4 = {
      transactionId: '',
      blockHash: '',
    };
    // RemoveManager
    const param5 = {
      transactionId: '1ca3efef989debabb48e53995c0020b7f38faa703df970fa6dbf4d95ac2482bb',
      blockHash: '67cb257f591ece63432170ee6fa04b687553795f459827ed08e497d45922f1c2',
    };
    // AddManager
    const param6 = {
      transactionId: '1c2e5c3e1a3d7e689f42969650ada0b609f89077810951acda3e22cdcf305f23',
      blockHash: 'a8e8e74f953e3d5e118a5c864b4bf77ea73f10536f036b8d88e9aa3acd0daf72',
    };

    dispatch(getActivityAsync(param));
    dispatch(getActivityAsync(param2));
    dispatch(getActivityAsync(param3));
    dispatch(getActivityAsync(param5));
    dispatch(getActivityAsync(param6));
  });

  useEffect(() => {
    console.log('>>>>activities', activity);
  }, [activity]);

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
    const params = {
      maxResultCount: 10,
      skipCount: activity.skipCount + activity.maxResultCount,
      caAddresses: caAddressList,
    };
    dispatch(getActivityListAsync(params));
  }

  return (
    <div className="activity-wrapper">
      {activity.totalRecordCount ? (
        <ActivityList
          data={activity.data}
          hasMore={activity.skipCount < activity.totalRecordCount}
          loadMore={loadMoreActivities}
        />
      ) : (
        <p className="empty">{t(EmptyTipMessage.NO_TRANSACTIONS)}</p>
      )}
    </div>
  );
}
