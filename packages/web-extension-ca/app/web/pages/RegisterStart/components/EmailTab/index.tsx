import { Button } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { ValidateHandler } from 'types/wallet';
import EmailInput, { EmailInputInstance } from '../EmailInput';

interface EmailTabProps {
  confirmText: string;
  validateEmail?: ValidateHandler;
  onFinish?: (email: string) => void;
}

export default function EmailTab({ confirmText, validateEmail, onFinish }: EmailTabProps) {
  const [val, setVal] = useState<string>();
  const [error, setError] = useState<string>();
  const emailInputInstance = useRef<EmailInputInstance>();
  const onClick = useCallback(async () => {
    try {
      await emailInputInstance?.current?.validateEmail(val);
      val && onFinish?.(val);
    } catch (error: any) {
      setError(error);
    }
  }, [onFinish, val]);

  return (
    <div className="email-sign-wrapper">
      <EmailInput
        val={val}
        ref={emailInputInstance}
        validate={validateEmail}
        error={error}
        onChange={(v) => {
          setError(undefined);
          setVal(v);
        }}
      />
      <Button className="login-primary-btn" type="primary" disabled={!val || !!error} onClick={onClick}>
        {confirmText}
      </Button>
    </div>
  );
}
