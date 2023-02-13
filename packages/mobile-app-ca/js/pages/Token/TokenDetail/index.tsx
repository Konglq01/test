import React, { useState, useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
// import { Dialog } from '@rneui/base';
import PageContainer from 'components/PageContainer';
import { unitConverter } from '@portkey/utils/converter';
import { ZERO } from '@portkey/constants/misc';
import { useAppCASelector, useAppCommonDispatch } from '@portkey/hooks/index';
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
import { getActivityListAsync } from '@portkey/store/store-ca/activity/action';
import useEffectOnce from 'hooks/useEffectOnce';
import { TokenItemShowType } from '@portkey/types/types-eoa/token';

export interface TokenDetailProps {
  route?: any;
}

// const originalData = {
//   currentPageNum: 0,
//   noMoreData: false,
//   refreshing: false,
//   isLoadingMore: false,
//   list: [],
// };

const currentNetworkMode = 'MAIN';

const TokenDetail: React.FC<TokenDetailProps> = props => {
  const { t } = useLanguage();
  const { route } = props;
  const {
    params: { tokenInfo },
  } = route;

  const navigation = useNavigation();

  const dispatch = useAppCommonDispatch();

  const activity = useAppCASelector(state => state.activity);

  // const [list, setList] = useState<any[]>([]);
  const [listShow, setListShow] = useState<any[]>([]);

  // const { balances } = useAppCASelector(state => state.tokenBalance);

  const [currentToken] = useState<TokenItemShowType>(tokenInfo);

  // const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(true); // first time

  // TODO: upDate balance
  // const upDateBalance = async () => {
  // };

  useEffect(() => {
    setListShow(activity.list);
  }, [activity]);

  useEffectOnce(() => {
    dispatch(getActivityListAsync({ type: 'MAIN' }));
  });

  const balanceFormat = useCallback((symbol: string, decimals = 8) => ZERO.plus('0').div(`1e${decimals}`), []);

  return (
    <PageContainer
      type="leftBack"
      backTitle={t('Back')}
      titleDom={
        <View>
          <TextXL style={[GStyles.textAlignCenter, FontStyles.font2]}>ELF</TextXL>
          <Text style={[GStyles.textAlignCenter, FontStyles.font2, styles.subTitle]}>MainChain AELF</Text>
        </View>
      }
      safeAreaColor={['blue', 'white']}
      leftCallback={() => navigation.goBack()}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.card}>
        <Text style={styles.tokenBalance}>
          {`${unitConverter(balanceFormat(currentToken?.symbol, currentToken?.decimals))} ${
            currentToken?.symbol || 'ELF'
          }`}
        </Text>
        {/* TODO : multiply rate */}
        {currentNetworkMode === 'MAIN' && (
          <Text style={styles.dollarBalance}>{`$ ${unitConverter(
            balanceFormat(currentToken?.symbol, currentToken?.decimals).multipliedBy('10'),
            2,
          )}`}</Text>
        )}
        <View style={styles.buttonGroupWrap}>
          <SendButton themeType="innerPage" sentToken={currentToken} />
          <View style={styles.space} />
          <ReceiveButton themeType="innerPage" receiveButton={currentToken} />
        </View>
      </View>
      {/* first time loading  */}
      {/* {isLoadingFirstTime && <Dialog.Loading />} */}
      {listShow.length === 0 && <NoData noPic message="You have no transactions." />}
      <FlashList
        data={listShow || []}
        renderItem={() => {
          return <TransferItem onPress={() => navigationService.navigate('ActivityDetail')} />;
        }}
      />
    </PageContainer>
  );
};

export default TokenDetail;
