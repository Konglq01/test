import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import PageContainer from 'components/PageContainer';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';

import navigationService from 'utils/navigationService';
import NoData from 'components/NoData';
import { useLanguage } from 'i18n/hooks';
import TransferItem from 'components/TransferList/components/TransferItem';
import { FlashList } from '@shopify/flash-list';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextXL } from 'components/CommonText';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { request } from '@portkey/api/api-did';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { unitConverter } from '@portkey/utils/converter';
import { ZERO } from '@portkey/constants/misc';
import { transactionTypesForActivityList as transactionList } from '@portkey/constants/constants-ca/activity';
import fonts from 'assets/theme/fonts';

interface RouterParams {
  tokenInfo: TokenItemShowType;
}

const MAX_RESULT_COUNT = 10;
const INIT_PAGE_INFO = {
  curPage: 0,
  total: 0,
  isLoading: false,
};

const TokenDetail: React.FC = () => {
  const { t } = useLanguage();
  const { tokenInfo } = useRouterParams<RouterParams>();
  const currentWallet = useCurrentWallet();
  const navigation = useNavigation();
  const [listShow, setListShow] = useState<any[]>([]);

  const fixedParamObj = useMemo(
    () => ({
      caAddresses: currentWallet.walletInfo.caAddressList,
      transactionTypes: transactionList,
      symbol: tokenInfo.symbol,
      chainId: tokenInfo.chainId,
    }),
    [currentWallet.walletInfo.caAddressList, tokenInfo.chainId, tokenInfo.symbol],
  );
  const pageInfoRef = useRef({
    ...INIT_PAGE_INFO,
  });

  const getActivityList = useCallback(
    async (isInit = false) => {
      if (!isInit && listShow.length > 0 && listShow.length >= pageInfoRef.current.total) return;
      if (pageInfoRef.current.isLoading) return;
      pageInfoRef.current.isLoading = true;
      try {
        const response = await request.activity.activityList({
          params: {
            ...fixedParamObj,
            skipCount: pageInfoRef.current.curPage * MAX_RESULT_COUNT,
            maxResultCount: MAX_RESULT_COUNT,
          },
        });
        pageInfoRef.current.curPage = pageInfoRef.current.curPage + 1;
        pageInfoRef.current.total = response.totalRecordCount;
        console.log('request.activity.activityList:', response);
        if (isInit) {
          setListShow(response.data);
        } else {
          setListShow(pre => pre.concat(response.data));
        }
      } catch (err) {
        console.log('request.activity.activityList: err', err);
      }
      pageInfoRef.current.isLoading = false;
    },
    [fixedParamObj, listShow.length],
  );

  const [currentToken] = useState<TokenItemShowType>(tokenInfo);
  const [reFreshing, setFreshing] = useState(false);
  const onRefreshList = useCallback(async () => {
    pageInfoRef.current = {
      ...INIT_PAGE_INFO,
    };
    setFreshing(true);
    await getActivityList(true);
    setFreshing(false);
  }, [getActivityList]);

  const balanceShow = `${unitConverter(ZERO.plus(tokenInfo?.balance || 0).div(`1e${tokenInfo.decimals}`))}`;

  return (
    <PageContainer
      type="leftBack"
      backTitle={t('')}
      titleDom={
        <View>
          <TextXL style={[GStyles.textAlignCenter, FontStyles.font2, fonts.mediumFont]}>{tokenInfo.symbol}</TextXL>
          <Text style={[GStyles.textAlignCenter, FontStyles.font2, styles.subTitle]}>{`${
            tokenInfo.chainId === 'AELF' ? 'MainChain' : 'SideChain'
          } ${tokenInfo.chainId}`}</Text>
        </View>
      }
      safeAreaColor={['blue', 'white']}
      leftCallback={() => navigation.goBack()}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.card}>
        <Text style={styles.tokenBalance}>{`${balanceShow} ${tokenInfo.symbol}`}</Text>
        {/* TODO : multiply rate */}
        {currentWallet?.currentNetwork === 'MAIN' && (
          <Text style={styles.dollarBalance}>{`$ ${tokenInfo?.balanceInUsd}`}</Text>
        )}
        <View style={styles.buttonGroupWrap}>
          <SendButton themeType="innerPage" sentToken={currentToken} />
          <View style={styles.space} />
          <ReceiveButton currentTokenInfo={tokenInfo} themeType="innerPage" receiveButton={currentToken} />
        </View>
      </View>
      {/* first time loading  */}
      {/* {isLoadingFirstTime && <Dialog.Loading />} */}
      {listShow.length === 0 && <NoData noPic message="You have no transactions." />}
      <FlashList
        refreshing={reFreshing}
        data={listShow || []}
        keyExtractor={(_item, index) => `${index}`}
        renderItem={({ item }: { item: ActivityItemType }) => {
          return (
            <TransferItem
              item={item}
              onPress={() =>
                navigationService.navigate('ActivityDetail', {
                  transactionId: item.transactionId,
                  blockHash: item.blockHash,
                  isReceived: item.isReceived,
                })
              }
            />
          );
        }}
        onRefresh={() => {
          onRefreshList();
        }}
        onEndReached={() => {
          getActivityList();
        }}
      />
    </PageContainer>
  );
};

export default TokenDetail;
