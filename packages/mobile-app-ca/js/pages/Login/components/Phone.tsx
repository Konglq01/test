import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { checkEmail } from '@portkey-wallet/utils/check';
import { BGStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import Touchable from 'components/Touchable';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { PageLoginType, PageType } from '../types';
import { CountryItem } from '@portkey-wallet/constants/constants-ca';
import TermsServiceButton from './TermsServiceButton';
import Button from './Button';
import { pTd } from 'utils/unit';
import { useOnLogin } from 'hooks/login';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';

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
  const [loading] = useState<boolean>();
  const [loginAccount, setLoginAccount] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [country, setCountry] = useState<CountryItem>(DefaultCountry);
  const onLogin = useOnLogin();
  const onPageLogin = useCallback(async () => {
    const message = checkEmail(loginAccount);
    setErrorMessage(message);
    if (message) return;
    Loading.show();
    try {
      await onLogin(loginAccount as string);
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
    }
    Loading.hide();
  }, [loginAccount, onLogin]);

  useEffectOnce(() => {
    const listener = myEvents[type === PageType.login ? 'clearLoginInput' : 'clearSignupInput'].addListener(() => {
      setLoginAccount('');
      setErrorMessage(undefined);
    });
    const countryListener = myEvents.setCountry.addListener(setCountry);
    return () => {
      countryListener.remove();
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
        <CommonInput
          leftIcon={
            <Touchable
              style={pageStyles.countryRow}
              onPress={() => navigationService.navigate('SelectCountry', { selectCountry: country })}>
              <Text>+ {country?.code}</Text>
              <Svg size={12} icon="down-arrow" />
            </Touchable>
          }
          value={loginAccount}
          type="general"
          maxLength={30}
          autoCorrect={false}
          onChangeText={setLoginAccount}
          errorMessage={errorMessage}
          keyboardType="numeric"
          placeholder={t('Enter Phone Number')}
          containerStyle={styles.inputContainerStyle}
        />

        <CommonButton
          containerStyle={GStyles.marginTop(16)}
          disabled={!loginAccount}
          type="primary"
          loading={loading}
          onPress={onPageLogin}>
          {t(TitleMap[type].button)}
        </CommonButton>
      </View>
      <TermsServiceButton />
    </View>
  );
}

const pageStyles = StyleSheet.create({
  countryRow: {
    height: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRightColor: defaultColors.border6,
    borderRightWidth: StyleSheet.hairlineWidth,
    marginLeft: pTd(16),
    paddingRight: pTd(10),
    width: pTd(68),
    justifyContent: 'space-between',
  },
});
