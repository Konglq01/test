import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { Button } from 'antd';
import { useCallback } from 'react';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';

export default function Login() {
  const login = useCallback(async (v: ISocialLogin) => {
    const result = await socialLoginAction(v);
    console.log(result, 'Login====');
  }, []);

  return (
    <div>
      <Button onClick={() => login('Google')}>Google</Button>
      <Button onClick={() => login('Apple')}>APPLE</Button>
    </div>
  );
}
