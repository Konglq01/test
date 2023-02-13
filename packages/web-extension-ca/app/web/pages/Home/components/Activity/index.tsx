import { useAppCASelector, useAppCommonDispatch } from '@portkey/hooks';
import { clearState } from '@portkey/store/store-ca/activity/slice';
import { Transaction } from '@portkey/types/types-ca/trade';
import ActivityList from 'pages/components/ActivityList';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import { useWalletInfo } from 'store/Provider/hooks';
import { getActivityListAsync } from '@portkey/store/store-ca/activity/action';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';

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

export default function Activity({ total, loading, rate, appendData, clearData }: ActivityProps) {
  const { t } = useTranslation();
  const { currentNetwork } = useWalletInfo();
  // TODO use this selector to get data
  const activities = useAppCASelector((state) => state.activity);
  const dispatch = useAppCommonDispatch();
  let ticking = false;
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

  useEffectOnce(() => {
    // TODO We need to get the activities of the current network
    // TODO If you want to get the latest data, please dispatch(clearState()) first
    dispatch(clearState());
    // dispatch(getActivityListAsync({ type: currentNetwork }));
  });

  useEffect(() => {
    console.log('>>>>activities', activities);
  }, [activities]);

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

  // const res = getActivityList({
  //   maxResultCount: 1,
  //   skipCount: 2,
  //   caAddresses: [],
  //   transactionTypes: [],
  //   chainId: '',
  //   symbol: '',
  // });

  const currentWallet = useCurrentWallet();

  const {
    walletInfo: { caAddressList },
  } = currentWallet;
  console.log('💩💩💩💩💩💩', caAddressList);
  const params = {
    maxResultCount: 1,
    skipCount: 2,
    caAddresses: [],
    transactionTypes: [],
    chainId: '',
    symbol: '',
  };
  // dispatch(getActivityListAsync(params));

  // console.log('🌈', res);

  return (
    // api/app/user/activities/activities
    <div className="activity-wrapper">
      {total ? (
        <ActivityList
          data={data}
          hasMore={false}
          loadMore={function (isRetry: boolean): Promise<void> {
            console.log(isRetry);
            throw new Error('Function not implemented.');
          }}
        />
      ) : (
        <p className="empty">{t(EmptyTipMessage.NO_TRANSACTIONS)}</p>
      )}
    </div>
  );
}
