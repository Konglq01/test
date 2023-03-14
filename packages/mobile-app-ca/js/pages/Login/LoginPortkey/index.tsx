import React, { useMemo, useState } from 'react';
import PageContainer, { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { TextM, TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { ImageBackground } from 'react-native';
import { isIos } from '@portkey-wallet/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import background from '../img/background.png';
import Svg from 'components/Svg';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import NetworkOverlay from 'components/NetworkOverlay';
import { useRoute } from '@react-navigation/native';
import styles from './styles';
import LoginEmail from './components/LoginEmail';
import LoginQRCode from './components/LoginQRCode';
import LoginPhone from './components/LoginPhone';
import LoginReferral from './components/LoginReferral';

const scrollViewProps = { extraHeight: 120 };
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];

export enum PageLoginType {
  email,
  qrCode,
  phone,
  referral,
}

export default function LoginPortkey() {
  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.referral);
  const { t } = useLanguage();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const route = useRoute();
  const loginMap = useMemo(
    () => ({
      [PageLoginType.email]: <LoginEmail setLoginType={setLoginType} />,
      [PageLoginType.qrCode]: <LoginQRCode setLoginType={setLoginType} />,
      [PageLoginType.phone]: <LoginPhone setLoginType={setLoginType} />,
      [PageLoginType.referral]: <LoginReferral setLoginType={setLoginType} />,
    }),
    [],
  );
  return (
    <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background}>
      <PageContainer
        pageSafeBottomPadding={!isIos}
        containerStyles={styles.containerStyles}
        safeAreaColor={safeAreaColor}
        scrollViewProps={scrollViewProps}
        hideHeader>
        <Svg icon="logo-icon" size={pTd(60)} iconStyle={styles.logoIconStyle} />
        <TextXXXL style={[styles.titleStyle, FontStyles.font11]}>{t('Log In To Portkey')}</TextXXXL>
        {loginMap[loginType]}
        <Touchable
          onPress={() => NetworkOverlay.showSwitchNetwork(route)}
          style={[GStyles.flexRow, GStyles.itemCenter, styles.networkRow]}>
          <TextM style={[FontStyles.font11, styles.networkTip]}>{currentNetworkInfo.name}</TextM>
          <Svg size={pTd(16)} icon="down-arrow" color={FontStyles.font11.color} />
        </Touchable>
      </PageContainer>
    </ImageBackground>
  );
}
