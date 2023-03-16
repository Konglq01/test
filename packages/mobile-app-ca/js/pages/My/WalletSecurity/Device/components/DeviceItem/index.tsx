import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { TextL, TextM, TextS, TextXL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import { formatTransferTime } from 'utils';
import { DeviceItemType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import Svg, { IconName } from 'components/Svg';

const deviceTypeIconMap: Record<DeviceType, IconName> = {
  [DeviceType.IOS]: 'phone-iOS',
  [DeviceType.ANDROID]: 'phone-Android',
  [DeviceType.MAC]: 'desk-mac',
  [DeviceType.WINDOWS]: 'desk-win',
  [DeviceType.OTHER]: 'desk-win',
};

interface DeviceItemProps {
  onPress?: (e: any) => void;
  isCurrent?: boolean;
  deviceItem: DeviceItemType;
}

const DeviceItemRender = ({ onPress, isCurrent, deviceItem }: DeviceItemProps) => {
  return (
    <Touchable onPress={onPress}>
      <View style={styles.deviceItemWrap}>
        <View style={styles.leftWrap}>
          <Svg
            icon={deviceTypeIconMap[deviceItem.deviceInfo.deviceType || DeviceType.OTHER]}
            size={pTd(16)}
            color={defaultColors.icon1}
          />
        </View>

        <View style={styles.deviceItemInfoWrap}>
          <View style={styles.deviceItemInfo}>
            <TextL>{deviceItem.deviceInfo.deviceName}</TextL>
            {isCurrent && <TextS style={styles.currentWrap}>Current</TextS>}
          </View>
          <TextM style={FontStyles.font7}>
            {deviceItem.transactionTime ? formatTransferTime(deviceItem.transactionTime) : ''}
          </TextM>
        </View>

        <Svg icon={'right-arrow'} size={pTd(20)} color={defaultColors.icon1} />
      </View>
    </Touchable>
  );
};
const DeviceItem = memo(DeviceItemRender);

export default DeviceItem;

const styles = StyleSheet.create({
  deviceItemWrap: {
    height: pTd(72),
    paddingHorizontal: pTd(16),
    marginBottom: pTd(24),
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftWrap: {
    marginRight: pTd(12),
    paddingTop: pTd(17),
    height: '100%',
  },
  deviceItemInfoWrap: {
    flex: 1,
    height: '100%',
    paddingVertical: pTd(14),
    justifyContent: 'space-between',
  },
  deviceItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentWrap: {
    marginLeft: pTd(12),
    height: pTd(20),
    borderWidth: 1,
    borderColor: defaultColors.border6,
    borderRadius: pTd(11),
    paddingHorizontal: pTd(10),
    lineHeight: pTd(18),
    color: defaultColors.font3,
  },
});
