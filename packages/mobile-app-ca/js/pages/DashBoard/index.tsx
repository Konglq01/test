import React from 'react';
import Card from './Card';
import { StyleSheet } from 'react-native';
import { useAppCommonDispatch } from '@portkey-wallet/hooks/index';
import DashBoardTab from './DashBoardTab';
import { defaultColors } from 'assets/theme';

import useEffectOnce from 'hooks/useEffectOnce';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { useGetCurrentCAViewContract } from 'hooks/contract';
import PageContainer from 'components/PageContainer';
import { getWalletNameAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';

interface DashBoardTypes {
  navigation: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let timer: any;

const DashBoard: React.FC<DashBoardTypes> = () => {
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  useEffectOnce(() => {
    getCurrentCAViewContract();
  });

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
      <Card balanceUSD={''} />
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
    backgroundColor: defaultColors.primaryColor,
  },
});
