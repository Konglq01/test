import React, { useCallback, useEffect } from 'react';
import PageContainer from 'components/PageContainer';
import PasswordInput from 'components/PasswordInput';
import { useSetState } from 'hooks';
import { checkPasswordInput } from '@portkey-wallet/utils/wallet';
import { RouteProp, useRoute } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import { changePassword } from '@portkey-wallet/store/wallet/actions';
import { useAppDispatch } from 'store/hooks';
import CommonToast from 'components/CommonToast';
import { isWalletError } from '@portkey-wallet/store/wallet/utils';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import CommonButton from 'components/CommonButton';
import useKeyboardHeight from 'hooks/useKeyboardHeight';
import GStyles from 'assets/theme/GStyles';
import { isIos } from 'utils/device';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';
const bottomHeight = !isIos ? 30 : 20;
const keyboardBottomHeight = !isIos ? bottomHeight : 0;
type State = {
  password?: string;
  pwdErrorMessage?: string;
  confirmPassword?: string;
  confirmPwdRule?: boolean;
};
type RouterParams = {
  password: string;
};
export default function ChangePassword() {
  const keyboardHeight = useKeyboardHeight();
  const [state, setState] = useSetState<State>();
  const { params } = useRoute<RouteProp<{ params: RouterParams }>>();
  const { password: oldPassword } = params || {};
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!oldPassword) navigationService.goBack();
  }, [oldPassword]);
  const { password, pwdErrorMessage, confirmPassword, confirmPwdRule } = state || {};
  const onNext = useCallback(async () => {
    // checkPassword
    const passwordMessage = checkPasswordInput(password);
    if (passwordMessage || !password) return setState({ pwdErrorMessage: passwordMessage });

    if (password !== confirmPassword) return setState({ confirmPwdRule: true });

    try {
      dispatch(changePassword({ password: oldPassword, newPassword: password }));
      CommonToast.success(i18n.t('Modified Successfully!'));
      navigationService.pop(2);
    } catch (error) {
      const errorMessage = isWalletError(error);
      errorMessage && CommonToast.fail(errorMessage);
    }
  }, [confirmPassword, dispatch, oldPassword, password, setState]);
  return (
    <PageContainer
      scrollViewProps={{ disabled: true }}
      type="leftBack"
      safeAreaColor={['blue', 'gray']}
      titleDom={t('Change Password')}
      containerStyles={[
        styles.containerStyles,
        keyboardHeight ? GStyles.paddingBottom(keyboardBottomHeight) : undefined,
      ]}>
      <View>
        <PasswordInput
          label={t('New Password (Must be at least 8 characters)')}
          value={password}
          onBlur={() => {
            setState({
              pwdErrorMessage: checkPasswordInput(password),
              confirmPwdRule: !!(confirmPassword && password && password !== confirmPassword),
            });
          }}
          placeholder={t('Enter New Password')}
          onChangeText={value => setState({ password: value })}
          errorMessage={t(pwdErrorMessage || '')}
          inputContainerStyle={styles.inputContainerStyle}
        />
        <PasswordInput
          label={t('Confirm New Password')}
          value={confirmPassword}
          placeholder={t('Enter New Password')}
          onBlur={() => setState({ confirmPwdRule: !!(confirmPassword && password && password !== confirmPassword) })}
          onChangeText={value => setState({ confirmPassword: value })}
          errorMessage={confirmPwdRule ? t('Passwords do not match') : undefined}
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>
      <CommonButton
        disabled={!confirmPassword || !password}
        containerStyle={isIos ? { marginBottom: keyboardHeight } : {}}
        type="primary"
        title={t('Save')}
        onPress={onNext}
      />
    </PageContainer>
  );
}
const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingBottom: bottomHeight,
    backgroundColor: defaultColors.bg4,
  },
  inputContainerStyle: {
    backgroundColor: defaultColors.bg1,
    borderColor: defaultColors.bg1,
  },
});
