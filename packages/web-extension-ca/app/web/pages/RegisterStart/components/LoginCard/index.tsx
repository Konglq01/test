import { useState } from 'react';
import { useNavigate } from 'react-router';
import InputLogin from '../InputLogin';
import SocialLogin from '../SocialLogin';

enum STEP {
  socialLogin,
  inputLogin,
}
export default function LoginCard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<STEP>(STEP.inputLogin);

  return (
    <div className="register-start-card login-card">
      {step === STEP.inputLogin ? (
        <InputLogin onBack={() => setStep(STEP.socialLogin)} />
      ) : (
        <SocialLogin loginByInput={() => setStep(STEP.inputLogin)} />
      )}
    </div>
  );
}
