import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PageContainer, { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { TextL, TextM, TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import CommonButton from 'components/CommonButton';
import { screenHeight, screenWidth, windowHeight } from '@portkey/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import { checkEmail } from '@portkey/utils/check';
import CommonInput from 'components/CommonInput';
import navigationService from 'utils/navigationService';
import background from '../img/background.png';
import Svg from 'components/Svg';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import qrCode from 'assets/image/pngs/QR-code.png';
import phone from 'assets/image/pngs/phone.png';
import Touchable from 'components/Touchable';
import QRCode from 'react-native-qrcode-svg';
import AElf from 'aelf-sdk';
import useEffectOnce from 'hooks/useEffectOnce';
import { WalletInfoType } from '@portkey/types/wallet';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import NetworkOverlay from 'components/NetworkOverlay';
import { useRoute } from '@react-navigation/native';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { LoginQRData } from '@portkey/types/types-ca/qrcode';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useAppDispatch } from 'store/hooks';
import { getChainListAsync, setCAInfoType } from '@portkey/store/store-ca/wallet/actions';
import { useGetHolderInfo, useGetVerifierServers } from 'hooks/guardian';
import Loading from 'components/Loading';
import { handleError, sleep } from '@portkey/utils';
import myEvents from 'utils/deviceEvent';
import { handleUserGuardiansList } from 'utils/login';
import { useIntervalQueryCAInfoByAddress } from '@portkey/hooks/hooks-ca/graphql';
import { handleWalletInfo } from '@portkey/utils/wallet';
import { useCredentials } from 'hooks/store';
import CommonToast from 'components/CommonToast';
const scrollViewProps = { extraHeight: 120 };
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];
type LoginType = 'email' | 'qr-code' | 'phone';
function LoginEmail({ setLoginType }: { setLoginType: (type: LoginType) => void }) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const [loading] = useState<boolean>();
  const [email, setEmail] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const chainInfo = useCurrentChain('AELF');
  const getVerifierServers = useGetVerifierServers();
  const getHolderInfo = useGetHolderInfo();
  const onLogin = useCallback(async () => {
    const message = checkEmail(email);
    setErrorMessage(message);
    if (message) return;
    setErrorMessage(undefined);
    // TODO Login
    Loading.show();
    await sleep(100);
    try {
      if (!chainInfo) await dispatch(getChainListAsync());
      const verifierServers = await getVerifierServers();
      const holderInfo = await getHolderInfo({ loginGuardianType: email });
      Loading.hide();
      await sleep(200);
      navigationService.navigate('GuardianApproval', {
        loginGuardianType: email,
        userGuardiansList: handleUserGuardiansList(holderInfo, verifierServers),
      });
    } catch (error) {
      setErrorMessage(handleError(error));
      Loading.hide();
    }
  }, [chainInfo, dispatch, email, getHolderInfo, getVerifierServers]);

  useEffectOnce(() => {
    const listener = myEvents.clearLoginInput.addListener(() => {
      setEmail('');
      setErrorMessage(undefined);
    });
    return () => listener.remove();
  });
  return (
    <View style={[BGStyles.bg1, styles.card]}>
      <Touchable style={styles.iconBox} onPress={() => setLoginType('qr-code')}>
        <Image source={qrCode} style={styles.iconStyle} />
      </Touchable>
      <CommonInput
        label="Email"
        type="general"
        value={email}
        placeholder={t('Enter Email')}
        maxLength={30}
        containerStyle={styles.inputContainerStyle}
        onChangeText={setEmail}
        errorMessage={errorMessage}
        keyboardType="email-address"
      />
      <CommonButton style={GStyles.marginTop(15)} disabled={!email} type="primary" loading={loading} onPress={onLogin}>
        {t('Log In')}
      </CommonButton>
      <Touchable
        style={[GStyles.flexRow, GStyles.itemCenter, styles.signUpTip]}
        onPress={() => navigationService.navigate('SignupPortkey')}>
        <TextL style={FontStyles.font3}>
          No account? <Text style={FontStyles.font4}>Sign up </Text>
        </TextL>
        <Svg size={pTd(20)} color={FontStyles.font4.color} icon="right-arrow2" />
      </Touchable>
    </View>
  );
}
function LoginQRCode({ setLoginType }: { setLoginType: (type: LoginType) => void }) {
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const [newWallet, setNewWallet] = useState<WalletInfoType>();
  const dispatch = useAppDispatch();
  const { pin } = useCredentials() || {};
  const caInfo = useIntervalQueryCAInfoByAddress(currentNetwork, newWallet?.address);
  useEffect(() => {
    if (caInfo) {
      if (pin) {
        try {
          dispatch(setCAInfoType({ caInfo, pin }));
          navigationService.reset('Tab');
        } catch (error) {
          CommonToast.failError(error);
        }
      } else {
        navigationService.navigate('SetPin', {
          caInfo,
          walletInfo: handleWalletInfo(newWallet),
          managerInfo: caInfo.managerInfo,
        });
      }
    }
  }, [caInfo, dispatch, newWallet, pin, walletInfo]);
  const generateKeystore = useCallback(() => {
    try {
      const wallet = walletInfo?.address ? walletInfo : AElf.wallet.createNewWallet();
      setNewWallet(wallet);
    } catch (error) {
      console.error(error);
    }
  }, [walletInfo]);
  useEffectOnce(() => {
    const timer = setTimeout(() => {
      generateKeystore();
    }, 10);
    let timer2: any;
    myEvents.clearQRWallet.addListener(() => {
      timer2 = setTimeout(() => {
        setNewWallet(undefined);
        timer2 && clearTimeout(timer2);
        timer2 = setTimeout(() => {
          generateKeystore();
        }, 200);
      }, 500);
    });
    return () => {
      timer && clearTimeout(timer);
      timer2 && clearTimeout(timer2);
    };
  });
  const qrData = useMemo(() => {
    if (!newWallet) return 'xxx';
    const data: LoginQRData = {
      // TODO: ethereum
      chainType: 'aelf',
      type: 'login',
      address: newWallet.address,
      netWorkType: currentNetwork,
    };
    return JSON.stringify(data);
  }, [currentNetwork, newWallet]);
  return (
    <View style={[BGStyles.bg1, styles.card]}>
      <Touchable style={styles.iconBox} onPress={() => setLoginType('email')}>
        <Image source={phone} style={styles.iconStyle} />
      </Touchable>
      <TextXXXL style={[styles.qrCodeTitle, GStyles.textAlignCenter]}>Scan code to log in</TextXXXL>
      <TextM style={[GStyles.textAlignCenter, FontStyles.font3]}>Please use the Portkey DApp to scan the QR code</TextM>
      <View style={[GStyles.alignCenter, styles.qrCodeBox]}>
        {!newWallet && (
          <View style={styles.loading}>
            <TextL>Updating...</TextL>
          </View>
        )}
        <QRCode value={qrData} size={200} />
      </View>
    </View>
  );
}
export default function LoginPortkey() {
  const [loginType, setLoginType] = useState<LoginType>('email');
  const { t } = useLanguage();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const route = useRoute();
  return (
    <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background}>
      <PageContainer
        containerStyles={styles.containerStyles}
        safeAreaColor={safeAreaColor}
        scrollViewProps={scrollViewProps}
        hideHeader>
        <Svg icon="logo-icon" size={pTd(60)} iconStyle={styles.logoIconStyle} />
        <TextXXXL style={[styles.titleStyle, FontStyles.font11]}>{t('Log In To Portkey')}</TextXXXL>
        {loginType === 'email' ? (
          <LoginEmail setLoginType={setLoginType} />
        ) : (
          <LoginQRCode setLoginType={setLoginType} />
        )}
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

const styles = StyleSheet.create({
  backgroundContainer: {
    height: screenHeight,
  },
  containerStyles: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  logoIconStyle: {
    marginTop: 44,
  },
  titleStyle: {
    marginTop: pTd(12),
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
  inputContainerStyle: {
    marginTop: 8,
  },
  viewContainer: {
    minHeight: windowHeight - pTd(160),
  },
  signUpbuttonStyle: {
    borderColor: defaultColors.primaryColor,
  },
  signUpTitleStyle: {
    color: defaultColors.primaryColor,
  },
  iconBox: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  iconStyle: {
    width: 60,
    height: 60,
  },
  signUpTip: {
    position: 'absolute',
    bottom: 32,
    left: 20,
  },
  qrCodeTitle: {
    marginTop: 18,
    marginBottom: 8,
  },
  qrCodeBox: {
    marginTop: 32,
  },
  loading: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: '#ffffffee',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkRow: {
    marginTop: 24,
  },
  networkTip: {
    marginRight: pTd(8),
  },
});
