import { Form, FormInstance } from 'antd';
import CustomPassword from 'components/CustomPassword';
import { ReactNode, useEffect, useState } from 'react';
import { isValidPassword } from '@portkey/utils/reg';
import { PasswordErrorMessage } from '@portkey/utils/wallet/types';
import './index.less';
import { useTranslation } from 'react-i18next';

const { Item: FormItem } = Form;

type ValidateFieldsType = FormInstance<any>['validateFields'];
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
interface ConfirmPasswordProps {
  value?: string;
  onChange?: (value: string) => void;
  validateFields?: ValidateFieldsType;
  isPasswordLengthTipShow?: boolean;
  label?: {
    password?: ReactNode;
    newPlaceholder?: string;
    confirmPassword?: ReactNode;
    confirmPlaceholder?: string;
  };
}

export default function ConfirmPassword({
  validateFields,
  value,
  onChange,
  isPasswordLengthTipShow = true,
  label,
}: ConfirmPasswordProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [createValidate, setCreateValidate] = useState<{
    validateStatus?: ValidateStatus;
    errorMsg?: string;
  }>({
    validateStatus: 'validating',
    errorMsg: '',
  });

  useEffect(() => {
    if (confirmPassword === password) {
      password && onChange?.(password);
      confirmPassword && validateFields?.(['confirmPassword']);
    } else {
      onChange?.('');
      confirmPassword && validateFields?.(['confirmPassword']);
    }
  }, [confirmPassword, onChange, password, validateFields]);

  return (
    <div className="confirm-password">
      <FormItem
        label={
          label?.password ? (
            label?.password
          ) : (
            <>
              <span style={{ marginRight: 8 }}>{t('Password (Must be at least 8 characters)')}</span>
            </>
          )
        }
        name="password1"
        validateStatus={createValidate.validateStatus}
        validateTrigger="onBlur"
        help={createValidate.errorMsg || (isPasswordLengthTipShow ? t('Must be at least 8 characters') : '')}
        rules={[
          { required: true, message: 'Please input your password!' },
          () => ({
            validator(_, value) {
              if (!value) {
                setCreateValidate({
                  validateStatus: 'validating',
                  errorMsg: '',
                });
                return Promise.reject('');
              }
              if (value.length < 8) {
                setCreateValidate({
                  validateStatus: 'error',
                  errorMsg: t(PasswordErrorMessage.passwordNotLong),
                });
                return Promise.reject(PasswordErrorMessage.passwordNotLong);
              }
              if (!isValidPassword(value)) {
                console.log(t(PasswordErrorMessage.invalidPassword));
                setCreateValidate({
                  validateStatus: 'error',
                  errorMsg: t(PasswordErrorMessage.invalidPassword),
                });
                return Promise.reject(PasswordErrorMessage.invalidPassword);
              }
              setCreateValidate({
                validateStatus: 'success',
                errorMsg: '',
              });
              return Promise.resolve();
            },
          }),
        ]}>
        <CustomPassword
          placeholder={label?.newPlaceholder || t('Enter Password')}
          value={value || password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormItem>
      <FormItem
        label={label?.confirmPassword ? label?.confirmPassword : t('Confirm Password')}
        name="confirmPassword"
        validateTrigger="onBlur"
        rules={[
          { required: true, message: t('Passwords do not match') },
          () => ({
            validator(_, value) {
              if (!value || password === value) {
                return Promise.resolve();
              }
              // if (value && !isValidPassword(value)) {
              //   return Promise.reject(new Error('Passwords do not match.'));
              // }
              return Promise.reject(new Error(t('Passwords do not match')));
            },
          }),
        ]}>
        <CustomPassword
          placeholder={label?.confirmPlaceholder || t('Enter Password')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormItem>
    </div>
  );
}
