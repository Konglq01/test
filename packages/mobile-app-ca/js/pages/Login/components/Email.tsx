import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { checkEmail } from '@portkey-wallet/utils/check';
import { BGStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import myEvents from 'utils/deviceEvent';
import styles from '../styles';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { PageLoginType, PageType } from '../types';
import { useOnLogin } from 'hooks/login';
import TermsServiceButton from './TermsServiceButton';
import Button from './Button';
import { pTd } from 'utils/unit';

const TitleMap = {
  [PageType.login]: {
    button: 'Log In',
  },
  [PageType.signup]: {
    button: 'Sign up',
  },
};

export default function Email({
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
    return () => listener.remove();
  });
  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter]}>
      <View style={GStyles.width100}>
        <View style={[GStyles.flexRow, GStyles.marginBottom(24)]}>
          <Button title="Phone" style={GStyles.marginRight(pTd(8))} onPress={() => setLoginType(PageLoginType.phone)} />
          <Button isActive title="Email" onPress={() => setLoginType(PageLoginType.email)} />
        </View>
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
