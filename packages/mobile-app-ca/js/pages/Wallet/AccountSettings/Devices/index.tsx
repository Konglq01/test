import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { TextM, TextS, TextXL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import Svg, { IconName } from 'components/Svg';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { formatTransferTime } from 'utils';

const Devices: React.FC = () => {
  const { t } = useLanguage();
  const deviceList = useDeviceList();
  const walletInfo = useCurrentWalletInfo();
  console.log('deviceList', deviceList);

  return (
    <PageContainer
      titleDom={t('Devices')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: false }}>
      {deviceList.map(item => (
        <Touchable key={item.managerAddress}>
          <View style={styles.deviceItemWrap}>
            <View style={styles.deviceItemInfoWrap}>
              <Svg icon={item.deviceTypeInfo.icon as IconName} size={pTd(16)} color={defaultColors.icon1} />
              <TextXL style={GStyles.marginLeft(10)}>{item.deviceTypeInfo.name}</TextXL>
              {walletInfo.address === item.managerAddress && <TextS style={styles.currentWrap}>Current</TextS>}
            </View>
            <TextM style={[GStyles.marginLeft(26), FontStyles.font7]}>
              {item.loginTime ? formatTransferTime(item.loginTime) : ''}
            </TextM>
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
