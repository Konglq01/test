import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { resetGuardiansState } from '@portkey/store/store-ca/guardians/actions';
import { Button, message } from 'antd';
import EmailInput, { EmailInputInstance } from 'pages/RegisterStart/components/EmailInput';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import useGuardianList from 'hooks/useGuardianList';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { LoginType } from '@portkey/types/types-ca/wallet';
import './index.less';

export default function EmailLogin() {
  const { loginAccount } = useLoginInfo();
  const { setLoading } = useLoading();
  const [error, setError] = useState<string>();
  const account = useMemo(
    () => (loginAccount?.createType === 'login' ? loginAccount.guardianAccount : undefined),
    [loginAccount],
  );
  const [val, setVal] = useState<string | undefined>(account);
  const emailInputInstance = useRef<EmailInputInstance>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();
  const fetchUserVerifier = useGuardianList();
  const loginHandler = useCallback(
    (guardianAccount: string) => {
      dispatch(
        setLoginAccountAction({
          guardianAccount,
          loginType: LoginType.email,
          createType: 'login',
        }),
      );
    },
    [dispatch],
  );

  const onLogin = useCallback(async () => {
    try {
      if (!val) return message.error('No Account');
      setLoading(true);
      await emailInputInstance?.current?.validateEmail(val, 'login');
      loginHandler(val);
      dispatch(resetGuardiansState());
      await fetchUserVerifier({ loginGuardianAccount: val });
      setLoading(false);

      navigate('/login/guardian-approval');
    } catch (error: any) {
      setLoading(false);
      console.error(error, 'error====onLogin');
      typeof error === 'string' ? setError(error) : message.error(error);
    }
  }, [val, dispatch, fetchUserVerifier, loginHandler, navigate, setLoading]);

  return (
    <div className="email-login-wrapper">
      <EmailInput
        currentNetwork={currentNetwork}
        val={val}
        ref={emailInputInstance}
        error={error}
        currentChain={currentChain}
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
