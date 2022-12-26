import React, { useCallback, useMemo, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { sleep } from '@portkey/utils';
import VerifyPasswordInput, { VerifyPasswordInputInterface } from 'components/VerifyPasswordInput';
import navigationService from 'utils/navigationService';
import CommonButton from 'components/CommonButton';
import { DeviceEventEmitter, StyleSheet } from 'react-native';
import useKeyboardHeight from 'hooks/useKeyboardHeight';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { RouteProp, useRoute } from '@react-navigation/native';
import { isIos } from 'utils/device';
import { useLanguage } from 'i18n/hooks';
type RouterParams = RouteProp<{ params: { openBiometrics?: boolean } }>;
const bottomHeight = !isIos ? 30 : 20;
const keyboardBottomHeight = !isIos ? bottomHeight : 0;

const ChangeTitle = {
  titleDom: 'Change Password',
  label: 'Old Password',
  placeholder: 'Enter Old Password',
  title: 'Next',
};
const biometricsTitle = {
  titleDom: 'Enter your password',
  label: 'Please enter your password in order to continue',
  placeholder: 'Enter Old Password',
  title: 'Confirm',
};

export default function CheckPassword() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState<boolean>();
  const { params } = useRoute<RouterParams>();
  const { openBiometrics } = params || {};
  const passwordRef = useRef<VerifyPasswordInputInterface>();
  const onNext = useCallback(async () => {
    if (!passwordRef.current) return;
    setLoading(true);
    await sleep(100);
    const [success, password] = await passwordRef.current.verifyPassword();
    setLoading(false);
    if (success) {
      if (openBiometrics) {
        DeviceEventEmitter.emit('openBiometrics', password);
        navigationService.goBack();
      } else {
        navigationService.navigate('ChangePassword', { password });
      }
    }
  }, [openBiometrics]);
  const keyboardHeight = useKeyboardHeight();
  const { titleDom, label, placeholder, title } = useMemo(
    () => (openBiometrics ? biometricsTitle : ChangeTitle),
    [openBiometrics],
  );
  return (
    <PageContainer
      scrollViewProps={{ disabled: true }}
      type="leftBack"
      safeAreaColor={['blue', 'gray']}
      titleDom={t(titleDom)}
      containerStyles={[
        styles.containerStyles,
        keyboardHeight ? GStyles.paddingBottom(keyboardBottomHeight) : undefined,
      ]}>
      <VerifyPasswordInput
        ref={passwordRef}
        label={t(label)}
        placeholder={t(placeholder)}
        inputContainerStyle={styles.inputContainerStyle}
      />
      <CommonButton
        containerStyle={isIos ? { marginBottom: keyboardHeight } : {}}
        type="primary"
        loading={loading}
        title={t(title)}
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
