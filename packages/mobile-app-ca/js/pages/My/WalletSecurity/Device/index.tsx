import React from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import DeviceItem from './components/DeviceItem';
import navigationService from 'utils/navigationService';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';

const DeviceList: React.FC = () => {
  const deviceList = useDeviceList();
  const walletInfo = useCurrentWalletInfo();

  return (
    <PageContainer
      titleDom={'Login Devices'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <TextM style={[FontStyles.font3, pageStyles.tipsWrap]}>
        {`You can manage your login devices and remove any device. 
Please note that when you log in again on a removed device, you will need to verify your identity through your guardians.`}
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
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 20, 18),
  },
  tipsWrap: {
    lineHeight: pTd(20),
    marginBottom: pTd(24),
  },
});

export default DeviceList;
