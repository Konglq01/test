import { useState } from 'react';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { ValidateHandler } from 'types/wallet';
import InputLogin from '../InputLogin';
import SocialLogin from '../SocialLogin';

enum STEP {
  socialLogin,
  inputLogin,
}
export default function LoginCard({
  onFinish,
  validateEmail,
  onSocialLoginFinish,
}: {
  onFinish: (data: LoginInfo) => void;
  validateEmail?: ValidateHandler;
  onSocialLoginFinish: (data: any) => void;
}) {
  const [step, setStep] = useState<STEP>(STEP.socialLogin);

  return (
    <div className="register-start-card login-card">
      {step === STEP.inputLogin ? (
        <InputLogin
          type="Login"
          validateEmail={validateEmail}
          onFinish={onFinish}
          onBack={() => setStep(STEP.socialLogin)}
        />
      ) : (
        <SocialLogin type="Login" onFinish={onSocialLoginFinish} switchLogin={() => setStep(STEP.inputLogin)} />
      )}
    </div>
  );
}
