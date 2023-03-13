import React, { memo } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM, TextS, TextXL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import { formatTransferTime } from 'utils';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/device';

interface DeviceItemProps {
  onPress?: (e: any) => void;
  isCurrent?: boolean;
  deviceItem: DeviceItemType;
}

const DeviceItemRender = ({ onPress, isCurrent, deviceItem }: DeviceItemProps) => {
  return (
    <Touchable onPress={onPress}>
      <View style={deviceItemStyles.deviceItemWrap}>
        <View style={deviceItemStyles.deviceItemInfoWrap}>
          {/* <Svg icon={item.deviceTypeInfo.icon as IconName} size={pTd(16)} color={defaultColors.icon1} /> */}
          <TextXL>{deviceItem.deviceInfo.deviceName}</TextXL>
          {isCurrent && <TextS style={deviceItemStyles.currentWrap}>Current</TextS>}
        </View>
        <TextM style={FontStyles.font7}>
          {deviceItem.transactionTime ? formatTransferTime(deviceItem.transactionTime) : ''}
        </TextM>
      </View>
    </Touchable>
  );
};
const DeviceItem = memo(DeviceItemRender);

const deviceItemStyles = StyleSheet.create({
  deviceItemWrap: {
    justifyContent: 'center',
    height: pTd(76),
    paddingHorizontal: pTd(16),
    marginBottom: pTd(24),
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
  },
  deviceItemInfoWrap: {
    flexDirection: 'row',
    marginBottom: pTd(4),
    alignItems: 'center',
  },
  currentWrap: {
    marginLeft: pTd(12),
    height: pTd(22),
    borderWidth: 1,
    borderColor: defaultColors.border1,
    borderRadius: pTd(12),
    paddingHorizontal: pTd(11),
    lineHeight: pTd(20),
    color: defaultColors.font3,
  },
});

interface RouterParams {
  devicePin: string;
}
const DeviceList: React.FC = () => {
  const { devicePin } = useRouterParams<RouterParams>();
  const deviceList = useDeviceList(devicePin);
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
