import { setLoginAccountAction } from '@portkey/store/store-ca/login/actions';
import { resetVerifierState } from '@portkey/store/store-ca/guardians/actions';
import { LoginType } from '@portkey/types/verifier';
import { Button, message } from 'antd';
import EmailInput, { EmailInputInstance } from 'pages/RegisterStart/components/EmailInput';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoginInfo } from 'store/Provider/hooks';
import './index.less';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';

export default function EmailLogin() {
  const { loginAccount } = useLoginInfo();
  const [error, setError] = useState<string>();
  const account = useMemo(
    () => (loginAccount?.createType === 'login' ? loginAccount.loginGuardianType : undefined),
    [loginAccount],
  );
  const [val, setVal] = useState<string | undefined>(account);
  const emailInputInstance = useRef<EmailInputInstance>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetworkInfo();
  const loginHandler = useCallback(() => {
    if (!val) return message.error('No Account');
    dispatch(
      setLoginAccountAction({
        loginGuardianType: val,
        accountLoginType: LoginType.email,
        createType: 'login',
      }),
    );
    dispatch(resetVerifierState());
    navigate('/login/guardian-approval');
  }, [dispatch, navigate, val]);

  const onLogin = useCallback(async () => {
    try {
      await emailInputInstance?.current?.validateEmail(val);
      val && loginHandler();
    } catch (error: any) {
      setError(error);
    }
  }, [loginHandler, val]);

  return (
    <div className="email-login-wrapper">
      <EmailInput
        currentNetwork={currentNetwork}
        val={val}
        ref={emailInputInstance}
        error={error}
        onChange={(v) => {
          setError(undefined);
          setVal(v);
        }}
      />
      <Button className="login-primary-btn" type="primary" disabled={!val || !!error} onClick={onLogin}>
        Login
      </Button>
    </div>
  );
}
