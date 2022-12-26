import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Dialog } from '@rneui/base';
import PageContainer from 'components/PageContainer';
import { unitConverter } from '@portkey/utils/converter';
import { ZERO } from '@portkey/constants/misc';
import { useAppEOASelector } from '@portkey/hooks/index';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import Svg from 'components/Svg';
import { styles } from './style';
import CommonTopTab, { TabItemTypes } from 'components/CommonTopTab';
import { useNavigation } from '@react-navigation/native';
import type { AccountType } from '@portkey/types/wallet';

import TransferList from '../../../components/TransferList';
import navigationService from 'utils/navigationService';
import NoData from 'components/NoData';
import { request } from 'api';
import { rsaEncryptObj } from 'utils/rsaEncrypt';
import { PUB_KEY } from 'constants/api';
import { useCurrentNetwork } from '@portkey/hooks/network';
import { getApiBaseData } from 'utils/wallet';
import { useCredentials } from 'hooks/store';
import useEffectOnce from 'hooks/useEffectOnce';
import { useGetELFRateQuery } from '@portkey/store/rate/api';
import { getCurrentAccount } from 'utils/redux';
import { getELFContract } from 'contexts/utils';
import { useAppDispatch } from 'store/hooks';
import { updateBalance } from '@portkey/store/tokenBalance/slice';
import { TokenItemShowType } from '@portkey/types/types-eoa/token';
import CommonToast from 'components/CommonToast';
import { useLanguage } from 'i18n/hooks';

export interface TokenDetailProps {
  route?: any;
}

export enum TokenTransferStatus {
  CONFIRMED = 'Confirmed',
  SENDING = 'Sending',
}

enum ActivityType {
  'All' = '0',
  'Out' = '1',
  'In' = '2',
}

const originalData = {
  currentPageNum: 0,
  noMoreData: false,
  refreshing: false,
  isLoadingMore: false,
  list: [],
};

const TokenDetail: React.FC<TokenDetailProps> = props => {
  const { t } = useLanguage();
  const { route } = props;
  const {
    params: { tokenInfo },
  } = route;

  const navigation = useNavigation();

  const { password } = useCredentials() || {};
  const { data: rate } = useGetELFRateQuery({});

  const dispatch = useAppDispatch();

  const { currentChain } = useAppEOASelector(state => state.chain);
  const { currentAccount } = useAppEOASelector(state => state.wallet);
  const { balances } = useAppEOASelector(state => state.tokenBalance);
  const currentNetwork = useCurrentNetwork();

  const [currentToken] = useState<TokenItemShowType>(tokenInfo);

  const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(true); // first time
  const [hasData, setHasData] = useState(false); //  if true, never present nodata
  const [allInfo, setAllInfo] = useState(originalData);
  const [inInfo, setInInfo] = useState(originalData);
  const [outInfo, setOutInfo] = useState(originalData);

  useEffectOnce(() => {
    getActivityList(allInfo.currentPageNum + 1, ActivityType.All, true);
    getActivityList(inInfo.currentPageNum + 1, ActivityType.In, true);
    getActivityList(outInfo.currentPageNum + 1, ActivityType.Out, true);
    setAllInfo({ ...allInfo, isLoadingMore: true });
    setInInfo({ ...inInfo, isLoadingMore: true });
    setOutInfo({ ...outInfo, isLoadingMore: true });
  });

  const initData = (type: string) => {
    switch (type) {
      case ActivityType.All:
        setAllInfo({ ...allInfo, noMoreData: false, refreshing: true, isLoadingMore: false });
        break;
      case ActivityType.In:
        setInInfo({ ...inInfo, noMoreData: false, refreshing: true, isLoadingMore: false });
        break;
      case ActivityType.Out:
        setOutInfo({ ...outInfo, noMoreData: false, refreshing: true, isLoadingMore: false });
        break;

      default:
        break;
    }
  };

  const getActivityList = async (page: string | number, type: string, firstTime?: boolean) => {
    if (!currentAccount) return;

    if (firstTime) initData(type);

    if (!firstTime) {
      switch (type) {
        case ActivityType.All:
          if (allInfo.isLoadingMore || allInfo.noMoreData) return;
          break;
        case ActivityType.In:
          if (inInfo.isLoadingMore || inInfo.noMoreData) return;
          break;
        case ActivityType.Out:
          if (outInfo.isLoadingMore || inInfo.noMoreData) return;
          break;

        default:
          break;
      }
    }

    const data = {
      symbol: tokenInfo.symbol || 'ELF',
      p: String(page),
      type,
    };

    const baseData = getApiBaseData({ currentNetwork, currentAccount, password: password || '' });
    const apiData = `${baseData}&${rsaEncryptObj(data, PUB_KEY)[0]}`;

    let res;
    try {
      res = await request.wallet.activityList({
        data: apiData,
        networkType: currentNetwork?.netWorkType || 'TESTNET', // todo  delete type
      });

      const tmpObj: any = {};
      switch (type) {
        case ActivityType.All:
          tmpObj.isLoadingMore = false;
          tmpObj.list = firstTime ? [...res.data.list] : [...allInfo.list, ...res.data.list];
          tmpObj.currentPageNum = allInfo.currentPageNum + 1;
          if (!res.data?.list.length) tmpObj.noMoreData = true;

          setIsLoadingFirstTime(false);

          if (res?.data?.list?.length > 0 && firstTime) setHasData(true);
          if (res?.data?.list?.length <= 0 && firstTime) setHasData(false);

          setAllInfo({ ...allInfo, ...tmpObj, refreshing: false });
          break;

        case ActivityType.In:
          tmpObj.isLoadingMore = false;
          tmpObj.list = firstTime ? [...res.data.list] : [...inInfo.list, ...res.data.list];

          tmpObj.currentPageNum = inInfo.currentPageNum + 1;
          if (!res.data?.list?.length) tmpObj.noMoreData = true;

          setInInfo({ ...inInfo, ...tmpObj, refreshing: false });
          break;
        case ActivityType.Out:
          tmpObj.isLoadingMore = false;
          tmpObj.list = firstTime ? [...res.data.list] : [...outInfo.list, ...res.data.list];

          tmpObj.currentPageNum = outInfo.currentPageNum + 1;
          if (!res.data?.list?.length) tmpObj.noMoreData = true;

          setOutInfo({ ...outInfo, ...tmpObj, refreshing: false });
          break;
        default:
          break;
      }
    } catch (error) {
      console.log('error');
      CommonToast.fail(t('Please Try Again Later'));
      switch (type) {
        case ActivityType.All:
          setAllInfo({
            ...allInfo,
            isLoadingMore: false,
            refreshing: false,
          });
          break;
        case ActivityType.In:
          setInInfo({
            ...inInfo,
            isLoadingMore: false,
            refreshing: false,
          });
          break;
        case ActivityType.Out:
          setOutInfo({
            ...outInfo,
            isLoadingMore: false,
            refreshing: false,
          });
          break;

        default:
          break;
      }
    }
  };

  // get balance
  const upDateBalance = async () => {
    try {
      const tmpAccount = getCurrentAccount(password || '', currentAccount as AccountType);
      if (!tmpAccount) return;
      const getContractParams = {
        rpcUrl: currentChain?.rpcUrl,
        contractAddress:
          currentChain.basicContracts?.tokenContract || 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
        account: tmpAccount,
      };

      const elfContract = await getELFContract(getContractParams);

      const accountBalance = await elfContract?.callViewMethod('GetBalance', {
        symbol: currentToken.symbol,
        owner: tmpAccount.address,
      });
      console.log('accountBalance', accountBalance);

      dispatch(
        updateBalance({
          rpcUrl: currentChain.rpcUrl,
          account: currentAccount?.address || '',
          balances: [accountBalance],
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffectOnce(() => {
    upDateBalance();
  });

  const balanceFormat = useCallback(
    (symbol: string, decimals = 8) =>
      ZERO.plus(balances?.[currentChain.rpcUrl]?.[currentAccount?.address ?? '']?.[symbol] ?? 0).div(`1e${decimals}`),
    [balances, currentAccount?.address, currentChain.rpcUrl],
  );

  const tabList: TabItemTypes[] = [
    {
      name: t('All'),
      tabItemDom:
        !allInfo.list.length && !allInfo.refreshing ? (
          <NoData />
        ) : (
          <TransferList
            refreshing={allInfo.refreshing}
            rate={rate || { USDT: 0 }}
            key="All"
            data={allInfo.list}
            style={styles.listWrap}
            onPress={item => navigationService.navigate('TransferDetail', { transferInfo: item })}
            onRefresh={() => {
              upDateBalance();
              setAllInfo({ ...allInfo, refreshing: true });
              getActivityList(1, ActivityType.All, true);
            }}
            onEndReached={() => {
              if (allInfo.isLoadingMore) return;
              getActivityList(allInfo.currentPageNum + 1, ActivityType.All);
            }}
          />
        ),
    },
    {
      name: t('Send'),
      tabItemDom:
        !outInfo?.list?.length && !outInfo.refreshing ? (
          <NoData />
        ) : (
          <TransferList
            refreshing={outInfo.refreshing}
            rate={rate || { USDT: 0 }}
            key="Send"
            style={styles.listWrap}
            data={outInfo.list}
            onPress={item => navigationService.navigate('TransferDetail', { transferInfo: item })}
            onRefresh={() => {
              upDateBalance();
              setOutInfo({ ...outInfo, refreshing: true });
              getActivityList(1, ActivityType.Out, true);
            }}
            onEndReached={() => {
              if (outInfo.isLoadingMore) return;
              getActivityList(outInfo.currentPageNum + 1, ActivityType.Out);
            }}
          />
        ),
    },
    {
      name: t('Receive'),
      tabItemDom:
        !inInfo.list.length && !inInfo.refreshing ? (
          <NoData />
        ) : (
          <TransferList
            refreshing={inInfo.refreshing}
            rate={rate || { USDT: 0 }}
            style={styles.listWrap}
            key="Receive"
            data={inInfo.list}
            onPress={item => navigationService.navigate('TransferDetail', { transferInfo: item })}
            onRefresh={() => {
              upDateBalance();
              setInInfo({ ...inInfo, refreshing: true });
              getActivityList(1, ActivityType.In, true);
            }}
            onEndReached={() => {
              if (inInfo.isLoadingMore) return;
              getActivityList(inInfo.currentPageNum + 1, ActivityType.In);
            }}
          />
        ),
    },
  ];

  return (
    <PageContainer
      type="leftBack"
      backTitle={t('Back')}
      titleDom={currentToken?.symbol}
      safeAreaColor={['blue', 'white']}
      leftCallback={() => navigation.goBack()}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.card}>
        <Svg icon="aelf-avatar" size={60} iconStyle={styles.tokenImage} />
        <Text style={styles.tokenBalance}>
          {`${unitConverter(balanceFormat(currentToken?.symbol, currentToken?.decimals))} ${currentToken?.symbol}`}
        </Text>

        <Text style={styles.dollarBalance}>{`$ ${unitConverter(
          balanceFormat(currentToken?.symbol, currentToken?.decimals).multipliedBy(rate?.USDT || 0),
          2,
        )} USD`}</Text>
        <View style={styles.buttonGroupWrap}>
          <SendButton themeType="innerPage" sentToken={currentToken} />
          <View style={styles.space} />
          <ReceiveButton themeType="innerPage" />
        </View>
      </View>
      {/* first time loading  */}
      {isLoadingFirstTime && <Dialog.Loading />}
      {!isLoadingFirstTime && (hasData ? <CommonTopTab tabList={tabList} /> : <NoData />)}
    </PageContainer>
  );
};

export default TokenDetail;
