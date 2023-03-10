import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ThreeWayLogin } from '@portkey-wallet/types/types-ca/wallet';
import { Button } from 'antd';
import type { IResolveParams } from 'reactjs-social-login';

const LoginSocialGoogle = dynamic(
  import('reactjs-social-login').then(i => i.LoginSocialGoogle),
  { ssr: false },
);
const LoginSocialApple = dynamic(
  import('reactjs-social-login').then(i => i.LoginSocialApple),
  { ssr: false },
);

export default function SocialTem({ loginType }: { loginType: ThreeWayLogin }) {
  const onSuccess = useCallback((response: IResolveParams) => {
    console.log(response, 'onResolve===LoginSocial');

    window.portkey_did?.request({
      method: 'portkey_loginByThreeWay',
      params: { response },
    });
  }, []);

  const onError = useCallback((error: any) => {
    console.log(error, 'onError===LoginSocial');
    window.portkey_did?.request({
      method: 'portkey_loginByThreeWay',
      params: { error: typeof error === 'string' ? error : error?.err || error },
    });
  }, []);

  return (
    <div>
      <>
        <LoginSocialGoogle
          isOnlyGetToken
          client_id={process.env.NEXT_PUBLIC_GG_APP_ID || ''}
          onResolve={onSuccess}
          onReject={onError}>
          <Button>LoginSocialGoogle</Button>
        </LoginSocialGoogle>

        <LoginSocialApple
          client_id={process.env.NEXT_PUBLIC_APP_APPLE_ID || ''}
          scope={'name email'}
          redirect_uri={'https://6bd8-123-113-146-87.jp.ngrok.io/appleAuth'}
          onResolve={onSuccess}
          onReject={onError}>
          {/* <AppleLoginButton /> */}
          <Button>LoginSocialApple</Button>
        </LoginSocialApple>
      </>
    </div>
  );
}
