import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AssetsList from '../AssetsList/index.';
import ActivityList from '../ActivityList/index.';
import CommonTopTab from 'components/CommonTopTab';
import { request } from 'api';
import { rsaEncryptObj } from 'utils/rsaEncrypt';
import { PUB_KEY } from 'constants/api';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { useCredentials, useWallet } from 'hooks/store';
import { getApiBaseData } from 'utils/wallet';
import { useBindTokens } from 'hooks/useBindToken';
import { useGetELFRateQuery } from '@portkey-wallet/store/rate/api';
import NoData from 'components/NoData';
import CommonToast from 'components/CommonToast';
import { useLanguage } from 'i18n/hooks';

let timer: string | number | NodeJS.Timeout | null | undefined = null;

const Card: React.FC<any> = () => {
  const isBinding = useBindTokens();
  const { t } = useLanguage();
  const { data: rate } = useGetELFRateQuery({});

  const currentNetwork = useCurrentNetwork();
  const { currentAccount } = useWallet();
  const { password } = useCredentials() || {};

  const [initiation, setInitiation] = useState(false);
  const [, setFetchingMore] = useState(false);
  const [isFetchingActivity, setIsFetchingActivity] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [activityInfo, setActivityInfo] = useState<{
    currentPage: number | string;
    totalNumber: number | string;
    activityShowList: any[];
    list: any[];
  }>({
    currentPage: 0,
    totalNumber: 0,
    activityShowList: [],
    list: [],
  });

  //  getActivityListDataPromise
  const getActivityListDataPromise = useCallback(
    (currentP: string | number): Promise<any> | undefined => {
      if (!currentAccount) return;

      const baseData = getApiBaseData({ currentAccount, currentNetwork, password: password || '' });
      const otherData = rsaEncryptObj(
        {
          p: String(currentP),
        },
        PUB_KEY,
      )[0];

      console.log('====================================', currentAccount.address);

      return request.wallet.transactionNotice({
        data: `${baseData}&${otherData}`,
        networkType: currentNetwork?.netWorkType || 'TESTNET', // todo  delete type
      });
    },
    [currentAccount, currentNetwork, password],
  );

  // get ActivityList
  const fetchActivityList = useCallback(
    async (pageNum: number | string, firstTime?: boolean) => {
      // init data
      if (firstTime) {
        setActivityInfo({
          ...activityInfo,
          currentPage: 0,
          totalNumber: 0,
        });
        setInitiation(true);
        setFetchingMore(false);
        setNoMoreData(false);
      }

      if (noMoreData && !firstTime) return;

      setIsFetchingActivity(true);
      setInitiation(true);

      console.log('page', activityInfo.currentPage);

      try {
        const P = await Promise.all(
          [1, 2, 3, 4].map(count => getActivityListDataPromise(Number(pageNum) + Number(count))),
        );
        setInitiation(false);

        console.log('-----------', currentAccount?.address);

        const totalNumber = P[0].data.count;

        let tmpList: any[] = [];
        P.map(ele => {
          tmpList = [...tmpList, ...ele.data.list];
        });

        console.log('tmpList', totalNumber, pageNum, tmpList);

        const list = firstTime ? [...tmpList] : [...activityInfo.list, ...tmpList];
        const activityShowList = list.filter(ele => ele.chain === currentNetwork.chainId);
        const currentPage = Number(activityInfo.currentPage) + 4;

        console.log('activityShowList', activityInfo.currentPage, activityShowList);

        setActivityInfo({
          totalNumber,
          list,
          activityShowList,
          currentPage,
        });

        console.log('\n\n\n pppppppp', P[3].data.list.length);

        if (P[3].data.list.length < 10) {
          // has got all data
          setNoMoreData(true);
          setIsFetchingActivity(false);
          return false;
        } else {
          if (activityShowList.length < 10) {
            // showData<10 continue fetch
            fetchActivityList(Number(pageNum) + 4);
          } else {
            // stop
            setIsFetchingActivity(false);
          }
        }

        if (initiation) setInitiation(false);
      } catch (error) {
        console.log('fetchActivityList error!!!', error);
        CommonToast.fail(t('Please Try Again Later'));
        setIsFetchingActivity(false);
        setFetchingMore(false);
      }
    },
    [
      noMoreData,
      activityInfo,
      currentAccount?.address,
      initiation,
      getActivityListDataPromise,
      currentNetwork.chainId,
      t,
    ],
  );

  const init = useCallback(() => {
    setActivityInfo({
      ...activityInfo,
      currentPage: 0,
      totalNumber: 0,
    });
    setInitiation(true);
    setNoMoreData(false);
    setFetchingMore(false);

    fetchActivityList(0, true);
  }, [activityInfo, fetchActivityList]);

  // getList
  useEffect(() => {
    // custom network
    if (!currentNetwork?.netWorkType) return;

    if (timer) clearInterval(timer);
    init();
    timer = setInterval(() => {
      init();
    }, 1000 * 60 * 5);

    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount?.address, currentNetwork]);

  const tabList = useMemo(() => {
    return [
      {
        name: t('Assets'),
        tabItemDom: <AssetsList initializing={isBinding} />,
      },
      {
        name: t('Activity'),
        tabItemDom: currentNetwork?.netWorkType ? (
          <ActivityList
            refreshing={initiation}
            rate={rate ?? { USDT: 0 }}
            keyExtractor={item => item.id}
            data={activityInfo.activityShowList}
            onRefresh={() => {
              if (timer) clearInterval(timer);
              init();
              timer = setInterval(() => {
                init();
              }, 1000 * 60 * 5);
            }}
            onEndReached={() => {
              if (noMoreData || isFetchingActivity) return;
              if (activityInfo?.list.length >= activityInfo.totalNumber) return;
              fetchActivityList(activityInfo.currentPage, false);
            }}
          />
        ) : (
          <NoData type="top" message={t('No transaction records accessible from the current custom network')} />
        ),
      },
    ];
  }, [
    activityInfo.activityShowList,
    activityInfo.currentPage,
    activityInfo?.list.length,
    activityInfo.totalNumber,
    currentNetwork?.netWorkType,
    fetchActivityList,
    init,
    initiation,
    isBinding,
    isFetchingActivity,
    noMoreData,
    rate,
    t,
  ]);

  return <CommonTopTab hasTabBarBorderRadius tabList={tabList} />;
};

export default Card;
