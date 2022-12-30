import { setLoginAccountAction } from '@portkey/store/store-ca/login/actions';
import { resetVerifierState } from '@portkey/store/store-ca/guardians/actions';
import { LoginType } from '@portkey/types/verifier';
import { Button, message } from 'antd';
import EmailInput, { EmailInputInstance } from 'pages/RegisterStart/components/EmailInput';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoading, useLoginInfo } from 'store/Provider/hooks';
import './index.less';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { loginGuardianTypeCheck } from '@portkey/api/apiUtils/verification';
import useAccountVerifierList from 'hooks/useGuardianList';

export default function EmailLogin() {
  const { loginAccount } = useLoginInfo();
  const { setLoading } = useLoading();
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
  const fetchUserVerifier = useAccountVerifierList();
  const loginHandler = useCallback(
    (loginGuardianType: string, caHash: string) => {
      dispatch(
        setLoginAccountAction({
          loginGuardianType: loginGuardianType,
          accountLoginType: LoginType.email,
          createType: 'login',
          caHash,
        }),
      );
    },
    [dispatch],
  );

  const onLogin = useCallback(async () => {
    try {
      if (!val) return message.error('No Account');
      setLoading(true);
      await emailInputInstance?.current?.validateEmail(val);
      // const result: any = await loginGuardianTypeCheck({
      //   type: LoginType.email,
      //   loginGuardianType: val,
      //   apiUrl: currentNetwork.apiUrl,
      // });
      // TODO
      const caHash = '652100680adc8283496d658834901e61c6a3ebeea8187c858b64dd16cc5e433c';

      loginHandler(val, caHash);
      dispatch(resetVerifierState());
      await fetchUserVerifier();
      setLoading(false);

      navigate('/login/guardian-approval');
    } catch (error: any) {
      setError(error);
    }
  }, [dispatch, fetchUserVerifier, loginHandler, navigate, setLoading, val]);

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
