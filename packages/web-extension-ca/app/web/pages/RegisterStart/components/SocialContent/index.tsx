import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { Button, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useCallback } from 'react';
import { RegisterType, SocialLoginFinishHandler } from 'types/wallet';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import './index.less';

interface GoogleBtnProps {
  onFinish?: SocialLoginFinishHandler;
  type: RegisterType;
}

export default function SocialContent({ type, onFinish }: GoogleBtnProps) {
  const login = useCallback(
    async (v: ISocialLogin) => {
      try {
        const result = await socialLoginAction(v);
        if (result.error) throw result.message ?? result.Error;
        onFinish?.({
          type: v,
          data: result.data?.data,
        });
      } catch (error) {
        const msg = handleErrorMessage(error);
        message.error(msg);
      }
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
