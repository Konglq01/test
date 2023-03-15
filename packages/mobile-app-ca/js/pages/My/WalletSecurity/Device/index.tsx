import React from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import DeviceItem from './components/DeviceItem';
import navigationService from 'utils/navigationService';

const DeviceList: React.FC = () => {
  const deviceList = useDeviceList();
  const walletInfo = useCurrentWalletInfo();

  return (
    <PageContainer
      titleDom={'Devices'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <TextM>
        Your wallet address is logged in on the following device, you can delete the device, after deletion, the device
        will exit the wallet.
      </TextM>
      {deviceList.map(item => (
        <DeviceItem
          key={item.managerAddress}
          deviceItem={item}
          isCurrent={walletInfo.address === item.managerAddress}
          onPress={() => {
            navigationService.navigate('DeviceDetail', { deviceItem: item });
          }}
        />
      ))}
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(0, 20, 18),
  },
});

export default DeviceList;
