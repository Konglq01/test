import React from 'react';
import Card from './Card';
import { useAppCommonDispatch } from '@portkey-wallet/hooks/index';
import DashBoardTab from './DashBoardTab';
import useEffectOnce from 'hooks/useEffectOnce';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { useGetCurrentCAViewContract } from 'hooks/contract';
import { getWalletNameAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { useGetGuardiansInfoWriteStore } from 'hooks/guardian';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useWallet } from 'hooks/store';

const DashBoard: React.FC = () => {
  const dispatch = useAppCommonDispatch();
  const wallet = useWallet();
  console.log(wallet, '===wallet');

  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  const { caHash } = useCurrentWalletInfo();
  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  useDeviceList();

  useEffectOnce(() => {
    getCurrentCAViewContract();
  });

  useEffectOnce(() => {
    dispatch(fetchTokenListAsync({ caAddresses: [] }));
    dispatch(getWalletNameAsync());
    dispatch(getSymbolImagesAsync());
    getGuardiansInfoWriteStore({
      caHash,
    });
  });

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <Card balanceUSD={''} />
      <DashBoardTab />
    </SafeAreaBox>
  );
};

export default DashBoard;
