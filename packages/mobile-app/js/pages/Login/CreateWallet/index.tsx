import React, { useCallback, useEffect, useState } from 'react';
import { useSetState } from 'hooks';
import { useAppDispatch } from 'store/hooks';
import navigationService from 'utils/navigationService';
import { authenticationReady, touchAuth } from 'utils/authentication';
import secureStore from 'utils/secureStore';
import { createWallet, setBackup } from '@portkey/store/wallet/actions';
import CommonToast from 'components/CommonToast';
import { sleep } from 'utils';
import { RouteProp, useRoute } from '@react-navigation/native';
import PasswordInput from 'components/PasswordInput';
import CommonInput from 'components/CommonInput';
import PageContainer from 'components/PageContainer';
import { setBiometrics, setCredentials } from 'store/user/actions';
import ListItem from 'components/ListItem';
import useBiometricsReady from 'hooks/useBiometrics';
import { checkPasswordInput, checkWalletNameInput } from '@portkey/utils/wallet';
import { isWalletError } from '@portkey/store/wallet/utils';
import { TextL, TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { StyleSheet, View } from 'react-native';
import CommonButton from 'components/CommonButton';
import CheckTermsOfService from 'components/CheckTermsOfService';
import { isIos, windowHeight } from 'utils/device';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';

type State = {
  walletName?: string;
  password?: string;
  pwdErrorMessage?: string;
  WalletNameErrorMessage?: string;
  confirmPassword?: string;
  confirmPwdRule?: boolean;
};
type RouterParams = {
  walletInfo: any;
};
const scrollViewProps = { extraHeight: 120 };
export default function CreateWallet() {
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const biometricsReady = useBiometricsReady();
  const [checked, setCheck] = useState<boolean>(false);
  const [openBiometrics, setOpenBiometrics] = useState<boolean | undefined>();
  const { params } = useRoute<RouteProp<{ params: RouterParams }>>();
  const isImport = !!params?.walletInfo;
  const [newWallet, setNewWallet] = useState(params?.walletInfo);
  const [loading, setLoading] = useState<boolean>();
  const [state, setState] = useSetState<State>();
  const { pwdErrorMessage, WalletNameErrorMessage, walletName, password, confirmPassword, confirmPwdRule } =
    state || {};
  // const generateKeystore = useCallback(() => {
  //   try {
  //     const wallet = AElf.wallet.createNewWallet();
  //     setNewWallet(wallet);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);
  // useEffectOnce(() => {
  //   if (isImport) return;
  //   const timer = setTimeout(() => {
  //     generateKeystore();
  //   }, 500);
  //   return () => {
  //     timer && clearTimeout(timer);
  //   };
  // });
  useEffect(() => setOpenBiometrics(biometricsReady), [biometricsReady]);
  const onCreate = useCallback(async () => {
    if (isImport && !newWallet) return;
    // checkPassword and checkWalletName
    const passwordMessage = checkPasswordInput(password);
    const walletNameMessage = checkWalletNameInput(walletName);
    if (passwordMessage || !password || walletNameMessage || !walletName)
      return setState({ pwdErrorMessage: passwordMessage, WalletNameErrorMessage: walletNameMessage });

    if (password !== confirmPassword) return setState({ confirmPwdRule: true });

    setLoading(true);
    await sleep(10);
    try {
      dispatch(
        createWallet({
          walletInfo: newWallet,
          password,
          walletName,
        }),
      );
      CommonToast.success(i18n.t('Created Successfully'));
      // import don't backup
      if (isImport) dispatch(setBackup({ password, isBackup: true }));
      // set credentials
      dispatch(setCredentials({ password }));
      if (openBiometrics) {
        try {
          const isReady = await authenticationReady();
          // authentication ready secure store password
          if (isReady) {
            // iOS manually open authenticate
            if (isIos) {
              const enrolled = await touchAuth();
              if (!enrolled.success) throw { message: enrolled.warning || enrolled.error };
            }
            // android secureStore requires authenticate by default
            await secureStore.setItemAsync('Password', password);
          }
          // set biometrics
          dispatch(setBiometrics(openBiometrics));
        } catch (error: any) {
          dispatch(setBiometrics(false));
          CommonToast.fail(typeof error.message === 'string' ? error.message : i18n.t('Failed to enable biometrics'));
        }
      }
      navigationService.reset('CreateSuccess', isImport ? { importSuccess: true } : undefined);
    } catch (error) {
      const errorMessage = isWalletError(error);
      errorMessage && CommonToast.fail(errorMessage);
    }
    setLoading(false);
  }, [confirmPassword, dispatch, isImport, newWallet, openBiometrics, password, setState, walletName]);
  return (
    <PageContainer type="leftBack" titleDom scrollViewProps={scrollViewProps}>
      <View style={styles.viewContainer}>
        <TextXXXL style={styles.titleStyle}>{t('Create a Name and Password')}</TextXXXL>
        <TextL style={styles.detailsStyle}>
          {t('This password is used to unlock your wallet only on this device')}
        </TextL>
        <CommonInput
          type="general"
          label={t('Wallet Name')}
          value={walletName}
          placeholder={t('Enter a Name')}
          maxLength={30}
          containerStyle={styles.inputContainerStyle}
          onBlur={() => setState({ WalletNameErrorMessage: checkWalletNameInput(walletName) })}
          onChangeText={value => setState({ walletName: value })}
          errorMessage={t(WalletNameErrorMessage || '')}
        />
        <PasswordInput
          label={t('Password (Must be at least 8 characters)')}
          value={password}
          maxLength={16}
          placeholder={t('Enter Password')}
          containerStyle={styles.inputContainerStyle}
          onBlur={() => {
            setState({
              pwdErrorMessage: checkPasswordInput(password),
              confirmPwdRule: !!(confirmPassword && password !== confirmPassword),
            });
          }}
          onChangeText={value => setState({ password: value })}
          errorMessage={t(pwdErrorMessage || '')}
        />
        <PasswordInput
          label={t('Confirm Password')}
          value={confirmPassword}
          maxLength={16}
          placeholder={t('Enter Password')}
          containerStyle={styles.inputContainerStyle}
          onBlur={() => setState({ confirmPwdRule: password !== confirmPassword })}
          onChangeText={value => setState({ confirmPassword: value })}
          errorMessage={confirmPwdRule ? t('Passwords do not match') : undefined}
        />
        {biometricsReady && (
          <ListItem
            disabled
            switchStyles={styles.switchStyles}
            style={styles.biometricsRow}
            title={t('Unlock with Biometrics?')}
            switching
            titleStyle={styles.switchTitleStyle}
            switchValue={openBiometrics}
            onValueChange={setOpenBiometrics}
          />
        )}
      </View>
      <View style={GStyles.marginBottom(20)}>
        <CheckTermsOfService checked={checked} onPress={setCheck} />
        <CommonButton
          disabled={
            !checked ||
            !!checkPasswordInput(password) ||
            !!checkWalletNameInput(walletName) ||
            password !== confirmPassword
          }
          type="primary"
          loading={loading}
          onPress={onCreate}>
          {t('Create')}
        </CommonButton>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  biometricsRow: {
    padding: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 0,
  },
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
  rightIconContainerStyle: {
    height: pTd(160),
    justifyContent: 'flex-end',
  },
  switchStyles: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  switchTitleStyle: {
    fontSize: pTd(14),
    color: defaultColors.font3,
  },
  viewContainer: {
    minHeight: windowHeight - pTd(180),
  },
});
