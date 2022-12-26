import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import PasswordInput from 'components/PasswordInput';
import { InputProps } from '@rneui/base';
import { checkPin } from 'utils/redux';
import { useLanguage } from 'i18n/hooks';
type VerifyPasswordInputProps = InputProps;
export type VerifyPasswordInputInterface = {
  verifyPassword: () => Promise<[boolean, string]>;
};
const VerifyPasswordInput = forwardRef((props: VerifyPasswordInputProps, forwardedRef) => {
  const [password, setPassword] = useState<string>();
  const { t } = useLanguage();
  const [passwordError, setPasswordError] = useState<boolean>();
  const verifyPassword = useCallback(async () => {
    if (!password) {
      setPasswordError(true);
      return [false, ''];
    }
    const success = checkPin(password);
    setPasswordError(!success);
    return [!!success, password];
  }, [password]);
  useImperativeHandle(forwardedRef, () => ({ verifyPassword }), [verifyPassword]);

  return (
    <PasswordInput
      value={password}
      label={props.label || t('Enter Password to Continue')}
      onChangeText={v => {
        setPassword(v);
        props.onChangeText?.(v);
      }}
      errorMessage={t(passwordError ? props.errorMessage || 'Invalid Password' : undefined || '')}
      placeholder={props.placeholder || t('Enter Password')}
      containerStyle={props.containerStyle}
      inputContainerStyle={props.inputContainerStyle}
    />
  );
});
VerifyPasswordInput.displayName = 'VerifyPasswordInput';
export default VerifyPasswordInput;
