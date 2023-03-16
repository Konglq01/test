import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useCallback } from 'react';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import './index.less';

interface GoogleBtnProps {
  onFinish?: (v: any) => void;
  type: 'Login' | 'Sign up';
}

export default function SocialContent({ type, onFinish }: GoogleBtnProps) {
  const login = useCallback(
    async (v: ISocialLogin) => {
      const result = await socialLoginAction(v);
      onFinish?.(result);
    },
    [onFinish],
  );

  return (
    <div className="social-content-wrapper">
      <Button onClick={() => login('Google')}>
        <CustomSvg type="Google" />
        {`${type} with Google`}
      </Button>
      <Button onClick={() => login('Apple')}>
        <CustomSvg type="Apple" />
        {`${type} with Apple`}
      </Button>
    </div>
  );
}
