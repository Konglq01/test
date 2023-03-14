import React, { useCallback, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getChainListAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { checkEmail } from '@portkey-wallet/utils/check';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import { useGetGuardiansInfoWriteStore, useGetVerifierServers } from 'hooks/guardian';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import { useAppDispatch } from 'store/hooks';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import Touchable from 'components/Touchable';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import qrCode from 'assets/image/pngs/QR-code.png';
import { PageLoginType } from '../index';
import { handleUserGuardiansList } from '@portkey-wallet/utils/guardian';
import { CountryItem } from '@portkey-wallet/constants/constants-ca';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';

const DefaultCountry = { country: 'Singapore', code: '65', iso: 'SG' };

export default function LoginReferral({ setLoginType }: { setLoginType: (type: PageLoginType) => void }) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const [loading] = useState<boolean>();
  const [loginAccount, setLoginAccount] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const chainInfo = useCurrentChain('AELF');
  const getVerifierServers = useGetVerifierServers();
  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  const [country, setCountry] = useState<CountryItem>(DefaultCountry);
  const onLogin = useCallback(async () => {
    const message = checkEmail(loginAccount);
    setErrorMessage(message);
    if (message) return;
    Loading.show();
    try {
      let _chainInfo;
      if (!chainInfo) {
        const chainList = await dispatch(getChainListAsync());
        if (Array.isArray(chainList.payload)) _chainInfo = chainList.payload[1];
      }
      const verifierServers = await getVerifierServers(_chainInfo);
      const holderInfo = await getGuardiansInfoWriteStore({ guardianIdentifier: loginAccount }, _chainInfo);
      navigationService.navigate('GuardianApproval', {
        loginAccount,
        userGuardiansList: handleUserGuardiansList(holderInfo, verifierServers),
      });
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
    }
    Loading.hide();
  }, [loginAccount, chainInfo, getVerifierServers, getGuardiansInfoWriteStore, dispatch]);

  useEffectOnce(() => {
    const listener = myEvents.clearLoginInput.addListener(() => {
      setLoginAccount('');
      setErrorMessage(undefined);
    });
    const listener2 = myEvents.setCountry.addListener(setCountry);
    return () => {
      listener2.remove();
      listener.remove();
    };
  });
  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter, GStyles.spaceBetween]}>
      <Touchable style={styles.iconBox} onPress={() => setLoginType(PageLoginType.qrCode)}>
        <Image source={qrCode} style={styles.iconStyle} />
      </Touchable>
      <View style={[GStyles.flexRow, GStyles.itemCenter]} />
      <Touchable
        style={[GStyles.flexRow, GStyles.itemCenter, styles.signUpTip]}
        onPress={() => navigationService.navigate('SignupPortkey')}>
        <TextL style={FontStyles.font3}>
          No account? <Text style={FontStyles.font4}>Sign up </Text>
        </TextL>
        <Svg size={pTd(20)} color={FontStyles.font4.color} icon="right-arrow2" />
      </Touchable>
      <Touchable
        style={[GStyles.flexRow, GStyles.itemCenter, styles.termsServiceTip]}
        onPress={() =>
          navigationService.navigate('ViewOnWebView', {
            title: 'Terms of Service',
            url: `${OfficialWebsite}/terms-of-service`,
          })
        }>
        <TextS style={FontStyles.font7}>
          Use the application according to <Text style={FontStyles.font4}>Terms of Service </Text>
        </TextS>
      </Touchable>
    </View>
  );
}
