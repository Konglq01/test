import React, { useCallback, useState } from 'react';
import PageContainer, { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { ImageBackground, StyleSheet, View } from 'react-native';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import { checkEmail, EmailError } from '@portkey-wallet/utils/check';
import CommonInput from 'components/CommonInput';
import navigationService from 'utils/navigationService';
import background from '../img/background.png';
import Svg from 'components/Svg';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { isIos, screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import { useGetGuardiansInfo, useGetVerifierServers } from 'hooks/guardian';
import { handleError } from '@portkey-wallet/utils';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useAppDispatch } from 'store/hooks';
import { getChainListAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import Loading from 'components/Loading';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];

const scrollViewProps = { extraHeight: 120 };
type SignupType = 'email' | 'phone';
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
      navigationService.navigate('SelectVerifier', { loginAccount: email });
    } catch (error) {
      setErrorMessage(handleError(error));
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
  const [signupType] = useState<SignupType>('email');
  const { t } = useLanguage();
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
        {signupType === 'email' ? <SignupEmail /> : null}
      </PageContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    height: screenHeight,
  },
  containerStyles: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  iconStyle: {},
  titleStyle: {
    marginTop: pTd(8),
    paddingHorizontal: pTd(20),
    alignSelf: 'center',
    textAlign: 'center',
  },
  detailsStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: pTd(10),
    color: defaultColors.font3,
    marginTop: pTd(8),
    marginBottom: pTd(24),
  },
  inputContainerStyle: {
    marginTop: 8,
  },
  card: {
    flex: 1,
    width: screenWidth - 32,
    borderRadius: 16,
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 32,
    minHeight: Math.min(screenHeight * 0.5, 416),
  },
});
