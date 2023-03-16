import { Button } from 'antd';
import { useCallback, useRef, useState } from 'react';
import EmailInput, { EmailInputInstance } from 'pages/RegisterStart/components/EmailInput';
import { useTranslation } from 'react-i18next';
import './index.less';

interface EmailTabProps {
  onSuccess: (email: string) => void;
  isTermsChecked?: boolean;
}

export default function EmailTab({ onSuccess }: EmailTabProps) {
  const [error, setError] = useState<string>();
  const [val, setVal] = useState<string>();
  const emailInputInstance = useRef<EmailInputInstance>();
  const { t } = useTranslation();

  const onSignUp = useCallback(async () => {
    try {
      await emailInputInstance?.current?.validateEmail(val);
      val && onSuccess(val);
    } catch (error: any) {
      setError(error);
    }
  }, [onSuccess, val]);

  return (
    <div className="email-sign-wrapper">
      <EmailInput
        val={val}
        ref={emailInputInstance}
        error={error}
        onChange={(v) => {
          setError(undefined);
          setVal(v);
        }}
      />
      <Button className="login-primary-btn" type="primary" disabled={!val || !!error} onClick={onSignUp}>
        {t('Sign Up')}
      </Button>
    </div>
  );
}
