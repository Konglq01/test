import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback } from 'react';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { TextM, TextS, TextXL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import Svg, { IconName } from 'components/Svg';
import { changeNetworkType } from '@portkey/store/store-ca/wallet/actions';
import { NetworkItem } from '@portkey/types/types-ca/network';
import { useNetworkList } from '@portkey/hooks/hooks-ca/network';
import { DeviceType, DEVICE_TYPE_INFO } from '@portkey/constants/constants-ca/wallet';

const deviceList = [
  {
    type: DeviceType.mac,
    info: DEVICE_TYPE_INFO[DeviceType.mac],
  },
  {
    type: DeviceType.windows,
    info: DEVICE_TYPE_INFO[DeviceType.windows],
  },
  {
    type: DeviceType.ios,
    info: DEVICE_TYPE_INFO[DeviceType.ios],
  },
  {
    type: DeviceType.android,
    info: DEVICE_TYPE_INFO[DeviceType.android],
  },
];

const Devices: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PageContainer
      titleDom={t('Devices')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: false }}>
      {/* TODO:  adjust key */}
      {deviceList.map((item, idx) => (
        <Touchable key={idx}>
          <View style={styles.deviceItemWrap}>
            <View style={styles.deviceItemInfoWrap}>
              <Svg icon={item.info.icon as IconName} size={pTd(16)} color={defaultColors.icon1} />
              <TextXL style={GStyles.marginLeft(10)}>{item.info.name}</TextXL>
              <TextS style={styles.currentWrap}>Current</TextS>
            </View>
            <TextM style={[GStyles.marginLeft(26), FontStyles.font7]}>Jul 6 at 5:20pm</TextM>
          </View>
        </Touchable>
      ))}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg6,
    ...GStyles.paddingArg(32, 20, 0),
  },
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

export default Devices;
