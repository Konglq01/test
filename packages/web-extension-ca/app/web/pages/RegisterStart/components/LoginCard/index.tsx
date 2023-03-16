import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';
import useGuardianList from 'hooks/useGuardianList';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { LoginInfo } from 'store/reducers/loginCache/type';
import InputLogin from '../InputLogin';
import SocialLogin from '../SocialLogin';

enum STEP {
  socialLogin,
  inputLogin,
}
export default function LoginCard() {
  const [step, setStep] = useState<STEP>(STEP.socialLogin);
  const { setLoading } = useLoading();
  const dispatch = useAppDispatch();
  const fetchUserVerifier = useGuardianList();
  const navigate = useNavigate();

  const loginHandler = useCallback(
    (loginInfo: LoginInfo) => {
      dispatch(
        setLoginAccountAction({
          guardianAccount: loginInfo.guardianAccount,
          loginType: loginInfo.loginType,
          createType: 'login',
        }),
      );
    },
    [dispatch],
  );
  const onFinish = useCallback(
    async (loginInfo: LoginInfo) => {
      try {
        setLoading(true);
        loginHandler(loginInfo);
        dispatch(resetGuardiansState());
        await fetchUserVerifier({ guardianIdentifier: loginInfo.guardianAccount });
        setLoading(false);
        navigate('/login/guardian-approval');
      } catch (error) {
        console.log(error, '====');
        const errMsg = handleErrorMessage(error, 'login error');
        message.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, fetchUserVerifier, loginHandler, navigate, setLoading],
  );

  const onSocialLoginFinish = useCallback((v: any) => {
    //
    console.log(v, 'onSocialLoginFinish====');
  }, []);

  return (
    <div className="register-start-card login-card">
      {step === STEP.inputLogin ? (
        <InputLogin type="Login" onFinish={onFinish} onBack={() => setStep(STEP.socialLogin)} />
      ) : (
        <SocialLogin type="Login" onFinish={onSocialLoginFinish} switchLogin={() => setStep(STEP.inputLogin)} />
      )}
    </div>
  );
}
