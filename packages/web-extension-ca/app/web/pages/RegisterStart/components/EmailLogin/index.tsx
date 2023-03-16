import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { Button, message } from 'antd';
import EmailInput, { EmailInputInstance } from 'pages/RegisterStart/components/EmailInput';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import useGuardianList from 'hooks/useGuardianList';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { RegisterType } from 'types/wallet';
import { handleErrorCode, handleErrorMessage } from '@portkey-wallet/utils';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import i18n from 'i18n';
import { EmailError } from '@portkey-wallet/utils/check';
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
          loginType: LoginType.Email,
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
      await emailInputInstance?.current?.validateEmail(val);
      loginHandler(val);
      dispatch(resetGuardiansState());
      await fetchUserVerifier({ guardianIdentifier: val });
      setLoading(false);

      navigate('/login/guardian-approval');
    } catch (error: any) {
      setLoading(false);
      console.error(error, 'error====onLogin');
      typeof error === 'string' ? setError(error) : message.error(error);
    }
  }, [val, dispatch, fetchUserVerifier, loginHandler, navigate, setLoading]);

  const validateEmail = useCallback(
    async (email?: string, type?: RegisterType | undefined) => {
      //
      if (!currentChain) throw 'Could not find chain information';
      let isHasAccount = false;
      try {
        const checkResult = await getHolderInfo({
          rpcUrl: currentChain.endPoint,
          address: currentChain.caContractAddress,
          chainType: currentNetwork.walletType,
          paramsOption: {
            guardianIdentifier: email as string,
          },
        });
        if (checkResult.guardianList?.guardians?.length > 0) {
          isHasAccount = true;
        }
      } catch (error: any) {
        const code = handleErrorCode(error);
        if (code?.toString === '3002') {
          isHasAccount = false;
        } else {
          throw handleErrorMessage(error || 'GetHolderInfo error');
        }
      }

      if (type === 'signUp') {
        if (isHasAccount) throw i18n.t(EmailError.alreadyRegistered);
      } else {
        if (!isHasAccount) throw i18n.t(EmailError.noAccount);
      }
    },
    [currentChain, currentNetwork.walletType],
  );

  return (
    <div className="email-login-wrapper">
      <EmailInput
        val={val}
        ref={emailInputInstance}
        error={error}
        validate={validateEmail}
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
