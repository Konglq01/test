import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { unitConverter } from '@portkey/utils/converter';
import { ZERO } from '@portkey/constants/misc';
import Card from './Card';
// import navigationService from 'utils/navigationService';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import { TokenItemShowType } from '@portkey/types/types-eoa/token';
// import Svg from 'components/Svg';
// import { clearBalance, updateBalance } from '@portkey/store/tokenBalance/slice';
import { useAppCommonDispatch, useAppEOASelector } from '@portkey/hooks/index';
import DashBoardTab from './DashBoardTab';
import SafeAreaBox from 'components/SafeAreaBox';
import { defaultColors } from 'assets/theme';
import Tips from './Tips';

import useEffectOnce from 'hooks/useEffectOnce';
import { MINUTE } from '@portkey/constants';
import { fetchTokenListAsync } from '@portkey/store/store-ca/assets/slice';

interface DashBoardTypes {
  navigation: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let timer: any;

const DashBoard: React.FC<DashBoardTypes> = () => {
  const [closed, setClosed] = useState<boolean>(false);
  const [balanceUSD, setBalanceUSD] = useState<string | number>('--');

  // const [balances, onGetBalance] = useBalances({
  //   tokens: localTokenList,
  //   tokenAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
  //   rpcUrl: 'https://explorer-test-side02.aelf.io/chain',
  // });
  const dispatch = useAppCommonDispatch();

  // // get account balance
  // const getAccountBalance = useCallback(async () => {
  //   //TODO fetchBalance
  //   const fetchBalance = (): Promise<number | string> =>
  //     new Promise(resolve => {
  //       setTimeout(() => {
  //         return resolve('100.00');
  //       }, 1000);
  //     });
  //   const result = await fetchBalance();
  //   setBalanceUSD(result);
  // }, []);

  // // if testTing ,show tips
  // useEffectOnce(() => {
  //   const isTesting = true;
  //   setClosed(!isTesting);
  // });

  // // get account Balance
  // const initAccountBalance = useCallback(() => {
  //   if (timer) clearInterval(timer);
  //   getAccountBalance();
  //   timer = setInterval(() => {
  //     getAccountBalance();
  //   }, 6 * MINUTE);
  // }, [getAccountBalance]);

  // useEffectOnce(() => {
  //   initAccountBalance();
  // });

  // useEffect(() => () => clearInterval(timer), []);

  useEffectOnce(() => {
    dispatch(fetchTokenListAsync({ type: 'MAIN' }));
  });

  // return <View style={{ backgroundColor: 'red', height: '100%' }} />;
  return (
    <SafeAreaBox edges={['top', 'left', 'right']} style={{ backgroundColor: defaultColors.bg5 }}>
      <Card balanceUSD={balanceUSD} />
      <DashBoardTab />
    </SafeAreaBox>
  );
};

export default DashBoard;
