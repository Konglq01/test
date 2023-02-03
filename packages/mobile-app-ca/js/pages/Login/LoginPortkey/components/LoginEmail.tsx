import React, { useCallback, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { getChainListAsync } from '@portkey/store/store-ca/wallet/actions';
import { handleError } from '@portkey/utils';
import { checkEmail } from '@portkey/utils/check';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import { useGetGuardiansInfoWriteStore, useGetVerifierServers } from 'hooks/guardian';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import { useAppDispatch } from 'store/hooks';
import myEvents from 'utils/deviceEvent';
import { handleUserGuardiansList } from 'utils/login';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import Touchable from 'components/Touchable';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import qrCode from 'assets/image/pngs/QR-code.png';
import { LoginType } from '..';

export default function LoginEmail({ setLoginType }: { setLoginType: (type: LoginType) => void }) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const [loading] = useState<boolean>();
  const [loginAccount, setLoginAccount] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const chainInfo = useCurrentChain('AELF');
  const getVerifierServers = useGetVerifierServers();
  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  const onLogin = useCallback(async () => {
    const message = checkEmail(loginAccount);
    setErrorMessage(message);
    if (message) return;
    Loading.show();
    try {
      if (!chainInfo) await dispatch(getChainListAsync());
      const verifierServers = await getVerifierServers();
      const holderInfo = await getGuardiansInfoWriteStore({ loginAccount });
      navigationService.navigate('GuardianApproval', {
        loginAccount,
        userGuardiansList: handleUserGuardiansList(holderInfo, verifierServers),
      });
    } catch (error) {
      setErrorMessage(handleError(error));
    }
    Loading.hide();
  }, [chainInfo, dispatch, loginAccount, getGuardiansInfoWriteStore, getVerifierServers]);

  useEffectOnce(() => {
    const listener = myEvents.clearLoginInput.addListener(() => {
      setLoginAccount('');
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
        value={loginAccount}
        label="Email"
        type="general"
        maxLength={30}
        autoCorrect={false}
        onChangeText={setLoginAccount}
        errorMessage={errorMessage}
        keyboardType="email-address"
        placeholder={t('Enter Email')}
        containerStyle={styles.inputContainerStyle}
      />
      <CommonButton
        style={GStyles.marginTop(15)}
        disabled={!loginAccount}
        type="primary"
        loading={loading}
        onPress={onLogin}>
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
