import React, { useEffect } from 'react';
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
import myEvents from 'utils/deviceEvent';

const DeviceList: React.FC = () => {
  const { deviceList, refetch } = useDeviceList();
  const walletInfo = useCurrentWalletInfo();

  useEffect(() => {
    const listener = myEvents.refreshDeviceList.addListener(() => {
      refetch();
    });
    return () => {
      listener.remove();
    };
  }, [refetch]);

  return (
    <PageContainer
      titleDom={'Login Devices'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <TextM style={[FontStyles.font3, pageStyles.tipsWrap]}>
        {`You may delete any device from the list, but you'll need to verify your identity through your guardians next time you log in to Portkey from the deleted device.`}
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
