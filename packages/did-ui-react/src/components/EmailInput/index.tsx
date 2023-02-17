import { Input } from 'antd';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { checkEmail } from '@portkey/utils/check';
import { ValidatorHandler } from '../../types';
import './index.less';

interface EmailInputProps {
  wrapperClassName?: string;
  error?: string;
  val?: string;
  onChange?: (val: string) => void;
  inputValidator?: ValidatorHandler;
}

export interface EmailInputInstance {
  validateEmail: ValidatorHandler;
}

const EmailInput = forwardRef(({ error, val, wrapperClassName, onChange, inputValidator }: EmailInputProps, ref) => {
  const { t } = useTranslation();

  const validateEmail = useCallback(
    async (email?: string) => {
      const checkError = checkEmail(email);
      if (checkError) throw checkError;
      await inputValidator?.(email);
    },
    [inputValidator],
  );

  useImperativeHandle(ref, () => ({ validateEmail }));

  return (
    <div className={clsx('email-input-wrapper', wrapperClassName)}>
      <div className="input-label">Email</div>
      <div className="input-wrapper">
        <Input
          className="login-input"
          value={val}
          placeholder={t('Enter email')}
          onChange={(e) => {
            onChange?.(e.target.value);
          }}
        />
        {error && <span className="error-text">{error}</span>}
      </div>
    </div>
  );
});

export default EmailInput;
