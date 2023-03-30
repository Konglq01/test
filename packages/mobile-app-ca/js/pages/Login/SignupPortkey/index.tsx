import React, { useMemo, useState } from 'react';
import PageContainer, { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { ImageBackground } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import background from '../img/background.png';
import Svg from 'components/Svg';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { isIos } from '@portkey-wallet/utils/mobile/device';
import myEvents from 'utils/deviceEvent';
import styles from '../styles';
import Email from '../components/Email';
import QRCode from '../components/QRCode';
import Phone from '../components/Phone';
import Referral from '../components/Referral';
import { PageLoginType, PageType } from '../types';
import SwitchNetwork from '../components/SwitchNetwork';
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];

const scrollViewProps = { extraHeight: 120 };

const BackType: any = {
  [PageLoginType.email]: true,
  [PageLoginType.phone]: true,
};
export default function SignupPortkey() {
  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.referral);
  const { t } = useLanguage();
  const signupMap = useMemo(
    () => ({
      [PageLoginType.email]: <Email setLoginType={setLoginType} type={PageType.signup} />,
      [PageLoginType.qrCode]: <QRCode setLoginType={setLoginType} />,
      [PageLoginType.phone]: <Phone setLoginType={setLoginType} type={PageType.signup} />,
      [PageLoginType.referral]: <Referral setLoginType={setLoginType} type={PageType.signup} />,
    }),
    [],
  );
  return (
    <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background}>
      <PageContainer
        titleDom
        type="leftBack"
        themeType="blue"
        pageSafeBottomPadding={!isIos}
        style={BGStyles.transparent}
        safeAreaColor={safeAreaColor}
        scrollViewProps={scrollViewProps}
        containerStyles={styles.containerStyles}
        leftCallback={
          BackType[loginType]
            ? () => setLoginType(PageLoginType.referral)
            : () => {
                myEvents.clearLoginInput.emit();
                navigationService.goBack();
              }
        }>
        <Svg icon="logo-icon" size={pTd(60)} iconStyle={styles.logoIconStyle} />
        <TextXXXL style={[styles.titleStyle, FontStyles.font11]}>{t('Sign up Portkey')}</TextXXXL>
        {signupMap[loginType]}
        <SwitchNetwork />
      </PageContainer>
    </ImageBackground>
  );
}
