import React, { useCallback, useMemo, useState } from 'react';
import PageContainer, { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { ImageBackground, View } from 'react-native';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import { checkEmail, EmailError } from '@portkey-wallet/utils/check';
import CommonInput from 'components/CommonInput';
import navigationService from 'utils/navigationService';
import background from '../img/background.png';
import Svg from 'components/Svg';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { isIos } from '@portkey-wallet/utils/mobile/device';
import { useGetGuardiansInfo, useGetVerifierServers } from 'hooks/guardian';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useAppDispatch } from 'store/hooks';
import { getChainListAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import Loading from 'components/Loading';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import styles from '../styles';
import Email from '../components/Email';
import QRCode from '../components/QRCode';
import Phone from '../components/Phone';
import Referral from '../components/Referral';
import { PageLoginType, PageType } from '../types';
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];

const scrollViewProps = { extraHeight: 120 };
function SignupEmail() {
  const { t } = useLanguage();
  const [loading] = useState<boolean>();
  const [email, setEmail] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const getGuardiansInfo = useGetGuardiansInfo();
  const getVerifierServers = useGetVerifierServers();
  const chainInfo = useCurrentChain('AELF');
  const dispatch = useAppDispatch();
  const onSignup = useCallback(async () => {
    const message = checkEmail(email);
    setErrorMessage(message);
    if (message) return;
    Loading.show();
    try {
      let _chainInfo;
      if (!chainInfo) {
        const chainList = await dispatch(getChainListAsync());
        if (Array.isArray(chainList.payload)) _chainInfo = chainList.payload[1];
      }
      await getVerifierServers(_chainInfo);
      try {
        const guardiansInfo = await getGuardiansInfo({ guardianIdentifier: email }, _chainInfo);
        if (guardiansInfo?.guardianAccounts || guardiansInfo?.guardianList) {
          Loading.hide();
          return setErrorMessage(EmailError.alreadyRegistered);
        }
      } catch (error) {
        console.log(error, '====error');
      }
      navigationService.navigate('SelectVerifier', { loginAccount: email, loginType: LoginType.Email });
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
    }
    Loading.hide();
  }, [chainInfo, dispatch, email, getGuardiansInfo, getVerifierServers]);
  useEffectOnce(() => {
    const listener = myEvents.clearSignupInput.addListener(() => {
      setEmail('');
      setErrorMessage(undefined);
    });
    return () => {
      listener.remove();
    };
  });

  return (
    <View style={[BGStyles.bg1, styles.card]}>
      <CommonInput
        value={email}
        label="Email"
        type="general"
        maxLength={30}
        autoCorrect={false}
        onChangeText={setEmail}
        errorMessage={errorMessage}
        keyboardType="email-address"
        placeholder={t('Enter Email')}
        containerStyle={styles.inputContainerStyle}
      />
      <CommonButton style={GStyles.marginTop(15)} disabled={!email} type="primary" loading={loading} onPress={onSignup}>
        {t('Sign up')}
      </CommonButton>
    </View>
  );
}

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
        leftCallback={() => {
          myEvents.clearLoginInput.emit();
          navigationService.goBack();
        }}>
        <Svg icon="logo-icon" size={pTd(60)} iconStyle={styles.iconStyle} />
        <TextXXXL style={[styles.titleStyle, FontStyles.font11]}>{t('Sign up Portkey')}</TextXXXL>
        {signupMap[loginType]}
      </PageContainer>
    </ImageBackground>
  );
}
