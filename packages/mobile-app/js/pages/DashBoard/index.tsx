import React, { useEffect, useMemo } from 'react';
import { unitConverter } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import Card from './Card';
// import navigationService from 'utils/navigationService';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
// import Svg from 'components/Svg';
// import { clearBalance, updateBalance } from '@portkey-wallet/store/tokenBalance/slice';
import { useAppEOASelector } from '@portkey-wallet/hooks/index';
import DashBoardTab from './DashBoardTab';
import SafeAreaBox from 'components/SafeAreaBox';
import { defaultColors } from 'assets/theme';

import { useGetELFRateQuery } from '@portkey-wallet/store/rate/api';
import PageContainer from 'components/PageContainer';

interface DashBoardTypes {
  navigation: any;
}

const DashBoard: React.FC<DashBoardTypes> = () => {
  const { data } = useGetELFRateQuery({});
  console.log(data, '===');

  // const [balances, onGetBalance] = useBalances({
  //   tokens: localTokenList,
  //   tokenAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
  //   rpcUrl: 'https://explorer-test-side02.aelf.io/chain',
  // });
  const { currentChain } = useAppEOASelector(state => state.chain);
  const { currentAccount } = useAppEOASelector(state => state.wallet);

  const { balances } = useAppEOASelector(state => state.tokenBalance);

  // const localTokenList = useCurrentAccountTokenList();

  const nativeBalance = useMemo(
    () => balances?.[currentChain.rpcUrl]?.[currentAccount?.address ?? '']?.ELF,
    [balances, currentAccount?.address, currentChain.rpcUrl],
  );

  // return <View style={{ backgroundColor: 'red', height: '100%' }} />;
  return (
    <SafeAreaBox edges={['top', 'left', 'right']} style={{ backgroundColor: defaultColors.bg5 }}>
      <Card
        balanceShow={unitConverter(
          ZERO.plus(nativeBalance ?? 0)
            .div(1e8)
            .multipliedBy(data?.USDT || 0),
          2,
        )}
        symbolShow={currentChain?.nativeCurrency?.symbol ?? 'ELF'}
      />
      <DashBoardTab />
    </SafeAreaBox>
  );
};

export default DashBoard;
