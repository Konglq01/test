import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import InputLogin from '../InputLogin';
import SocialLogin from '../SocialLogin';

enum STEP {
  socialLogin,
  inputLogin,
}
export default function SignCard() {
  const [step, setStep] = useState<STEP>(STEP.socialLogin);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onFinish = useCallback(
    (data: { loginType: LoginType; guardianAccount: string }) => {
      dispatch(
        setLoginAccountAction({
          guardianAccount: data.guardianAccount,
          loginType: data.loginType,
          createType: 'register',
        }),
      );
      dispatch(resetGuardiansState());
      navigate('/register/select-verifier');
    },
    [dispatch, navigate],
  );

  const onSocialLoginFinish = useCallback(() => {
    //
  }, []);

  return (
    <div className="register-start-card sign-card">
      {step === STEP.inputLogin ? (
        <InputLogin type="Sign up" onFinish={onFinish} onBack={() => setStep(STEP.socialLogin)} />
      ) : (
        <SocialLogin
          type="Sign up"
          onFinish={onSocialLoginFinish}
          switchLogin={() => setStep(STEP.inputLogin)}
          onBack={() => navigate('/register/start')}
        />
      )}
    </div>
  );
}
