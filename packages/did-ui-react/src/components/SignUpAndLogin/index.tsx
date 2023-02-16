import SignUpAndLoginCom, { SignUpAndLoginProps } from './index.component';
import { BaseConfigProvider } from '../config-provider';

export default function LoginBase(props?: SignUpAndLoginProps) {
  return (
    <BaseConfigProvider>
      <SignUpAndLoginCom {...props} />
    </BaseConfigProvider>
  );
}
