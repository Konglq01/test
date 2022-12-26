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
              <span style={{ marginRight: 8 }}>{t('Pin (Must be at least 8 characters)')}</span>
            </>
          )
        }
        name="password1"
        validateStatus={createValidate.validateStatus}
        validateTrigger="onBlur"
        help={createValidate.errorMsg || (isPasswordLengthTipShow ? t('Must be at least 8 characters') : undefined)}
        rules={[
          { required: true, message: t('Please enter Pin!') },
          () => ({
            validator(_, value) {
              if (!value) {
                setCreateValidate({
                  validateStatus: 'error',
                  errorMsg: t('Please enter Pin!'),
                });
                return Promise.reject(t('Please enter Pin!'));
              }
              if (value.length < 8) {
                setCreateValidate({
                  validateStatus: 'error',
                  errorMsg: t(PasswordErrorMessage.passwordNotLong),
                });
                return Promise.reject(t(PasswordErrorMessage.passwordNotLong));
              }
              if (!isValidPassword(value)) {
                setCreateValidate({
                  validateStatus: 'error',
                  errorMsg: t(PasswordErrorMessage.invalidPassword),
                });
                return Promise.reject(t(PasswordErrorMessage.invalidPassword));
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
          placeholder={label?.newPlaceholder || t('Enter Pin')}
          value={value || password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormItem>
      <FormItem
        label={label?.confirmPassword ? label?.confirmPassword : t('Confirm Pin')}
        name="confirmPassword"
        validateTrigger="onBlur"
        rules={[
          { required: true, message: t('Please enter Pin!') },
          () => ({
            validator(_, value) {
              if (!value || password === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('Pins do not match')));
            },
          }),
        ]}>
        <CustomPassword
          placeholder={label?.confirmPlaceholder || t('Enter Pin')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormItem>
    </div>
  );
}
