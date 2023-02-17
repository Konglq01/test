import { Button, message } from 'antd';
import EmailInput, { EmailInputInstance } from '../EmailInput';
import { useCallback, useRef, useState } from 'react';
import { setLoading } from '../../utils/loading';
import './index.less';

export interface EmailLoginProps {
  onLogin?: (value: string) => void;
  inputValidator?: (value?: string) => Promise<any>;
}

export default function EmailLogin({ onLogin, inputValidator }: EmailLoginProps) {
  const [error, setError] = useState<string>();
  const [val, setVal] = useState<string | undefined>('');
  const emailInputInstance = useRef<EmailInputInstance>();

  const onLoginHandler = useCallback(async () => {
    try {
      console.log(val, 'val===checkError');
      setLoading(true);
      console.log('setLoading', 'val===checkError111');
      await emailInputInstance?.current?.validateEmail(val);
      if (!val) throw 'No Account';
      setLoading(false);
      onLogin?.(val);
    } catch (error: any) {
      setLoading(false);
      console.error(error, 'error====onLogin');
      typeof error === 'string' ? setError(error) : message.error(error);
    }
  }, [onLogin, val]);

  const _inputValidator = useCallback(async (v?: string) => inputValidator?.(v), [inputValidator]);

  return (
    <div className="email-login-wrapper">
      <EmailInput
        val={val}
        ref={emailInputInstance}
        error={error}
        inputValidator={_inputValidator}
        onChange={(v) => {
          setError(undefined);
          setVal(v);
        }}
      />
      <Button className="login-primary-btn" type="primary" disabled={!val || !!error} onClick={onLoginHandler}>
        Login
      </Button>
    </div>
  );
}
