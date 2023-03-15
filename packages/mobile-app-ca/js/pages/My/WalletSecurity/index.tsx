import React from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import MenuItem from '../components/MenuItem';
import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import navigationService from 'utils/navigationService';

const WalletSecurity: React.FC = () => {
  const deviceList = useDeviceList();

  return (
    <PageContainer
      titleDom={'Wallet Security'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <MenuItem
        title="Manage Devices"
        suffix={deviceList.length}
        onPress={() => {
          navigationService.navigate('DeviceList');
        }}
      />
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

export default WalletSecurity;
