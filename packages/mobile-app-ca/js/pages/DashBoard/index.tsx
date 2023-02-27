import React, { useState } from 'react';
import Card from './Card';
import { StyleSheet } from 'react-native';
// import navigationService from 'utils/navigationService';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import { TokenItemShowType } from '@portkey/types/types-eoa/token';
// import Svg from 'components/Svg';
// import { clearBalance, updateBalance } from '@portkey/store/tokenBalance/slice';
import { useAppCommonDispatch } from '@portkey/hooks/index';
import DashBoardTab from './DashBoardTab';
import SafeAreaBox from 'components/SafeAreaBox';
import { defaultColors } from 'assets/theme';

import useEffectOnce from 'hooks/useEffectOnce';
import { MINUTE } from '@portkey/constants';
import { fetchTokenListAsync } from '@portkey/store/store-ca/assets/slice';
import { useGetCurrentCAViewContract } from 'hooks/contract';
import PageContainer from 'components/PageContainer';
import { useAppDispatch } from 'store/hooks';
import { getWalletNameAsync } from '@portkey/store/store-ca/wallet/actions';
import { getSymbolImagesAsync } from '@portkey/store/store-ca/tokenManagement/action';

interface DashBoardTypes {
  navigation: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let timer: any;

const DashBoard: React.FC<DashBoardTypes> = () => {
  const [closed, setClosed] = useState<boolean>(false);
  const [balanceUSD, setBalanceUSD] = useState<string | number>('--');
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  useEffectOnce(() => {
    getCurrentCAViewContract();
  });

  // const [balances, onGetBalance] = useBalances({
  //   tokens: localTokenList,
  //   tokenAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
  //   rpcUrl: 'https://explorer-test-side02.aelf.io/chain',
  // });
  const dispatch = useAppCommonDispatch();

  useEffectOnce(() => {
    dispatch(fetchTokenListAsync({ caAddresses: [] }));
    dispatch(getWalletNameAsync());
    dispatch(getSymbolImagesAsync());
  });

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <Card balanceUSD={balanceUSD} />
      <DashBoardTab />
    </PageContainer>
  );

  // return <SafeAreaBox edges={['top', 'left', 'right']} style={{ backgroundColor: defaultColors.bg5 }} />;
};

export default DashBoard;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
    height: '100%',
  },
});
