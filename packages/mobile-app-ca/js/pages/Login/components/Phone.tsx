import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getChainListAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { checkEmail } from '@portkey-wallet/utils/check';
import { BGStyles } from 'assets/theme/styles';
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
import { PageLoginType, PageType } from '../types';
import { handleUserGuardiansList } from '@portkey-wallet/utils/guardian';
import { CountryItem } from '@portkey-wallet/constants/constants-ca';
import TermsServiceButton from './TermsServiceButton';
import Button from './Button';
import { pTd } from 'utils/unit';

const DefaultCountry = { country: 'Singapore', code: '65', iso: 'SG' };

const TitleMap = {
  [PageType.login]: {
    button: 'Log In',
  },
  [PageType.signup]: {
    button: 'Sign up',
  },
};

export default function Phone({
  setLoginType,
  type = PageType.login,
}: {
  setLoginType: (type: PageLoginType) => void;
  type?: PageType;
}) {
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
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter]}>
      <View style={GStyles.width100}>
        <View style={[GStyles.flexRow, GStyles.marginBottom(24)]}>
          <Button
            title="Phone"
            isActive
            style={GStyles.marginRight(pTd(8))}
            onPress={() => setLoginType(PageLoginType.phone)}
          />
          <Button title="Email" onPress={() => setLoginType(PageLoginType.email)} />
        </View>
        <View style={[GStyles.flexRow, GStyles.itemCenter]}>
          <Touchable onPress={() => navigationService.navigate('SelectCountry', { selectCountry: country })}>
            <Text>+{country?.code}</Text>
          </Touchable>
          <CommonInput
            value={loginAccount}
            type="general"
            maxLength={30}
            autoCorrect={false}
            onChangeText={setLoginAccount}
            errorMessage={errorMessage}
            keyboardType="email-address"
            placeholder={t('Enter Email')}
            containerStyle={styles.inputContainerStyle}
          />
        </View>

        <CommonButton
          containerStyle={GStyles.marginTop(16)}
          disabled={!loginAccount}
          type="primary"
          loading={loading}
          onPress={onLogin}>
          {t(TitleMap[type].button)}
        </CommonButton>
      </View>
      <TermsServiceButton />
    </View>
  );
}
