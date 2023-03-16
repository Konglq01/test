import { useState } from 'react';
import { useNavigate } from 'react-router';
import InputLogin from '../InputLogin';
import SocialLogin from '../SocialLogin';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { ValidateHandler } from 'types/wallet';

enum STEP {
  socialLogin,
  inputLogin,
}
export default function SignCard({
  onFinish,
  validateEmail,
  onSocialSignFinish,
}: {
  onFinish: (data: LoginInfo) => void;
  validateEmail?: ValidateHandler;
  onSocialSignFinish: (data: any) => void;
}) {
  const [step, setStep] = useState<STEP>(STEP.socialLogin);

  const navigate = useNavigate();

  return (
    <div className="register-start-card sign-card">
      {step === STEP.inputLogin ? (
        <InputLogin
          type="Sign up"
          validateEmail={validateEmail}
          onFinish={onFinish}
          onBack={() => setStep(STEP.socialLogin)}
        />
      ) : (
        <SocialLogin
          type="Sign up"
          onFinish={onSocialSignFinish}
          switchLogin={() => setStep(STEP.inputLogin)}
          onBack={() => navigate('/register/start')}
        />
      )}
    </div>
  );
}
