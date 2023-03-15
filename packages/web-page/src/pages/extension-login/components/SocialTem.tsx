import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { Button } from 'antd';
import type { IResolveParams } from 'reactjs-social-login';

const _LoginSocialGoogle = import('reactjs-social-login').then(i => i.LoginSocialGoogle);
const _LoginSocialApple = import('reactjs-social-login').then(i => i.LoginSocialApple);

const LoginSocialGoogle = dynamic(_LoginSocialGoogle, { ssr: false });
const LoginSocialApple = dynamic(_LoginSocialApple, { ssr: false });

export default function SocialTem({ loginType }: { loginType: ISocialLogin }) {
  const onSuccess = useCallback(async (response: IResolveParams) => {
    console.log(response, 'onResolve===LoginSocial');
    if (!response.data) return;
    const user = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${response.data.access_token}` },
    }).then(res => res.json());
    console.log(user, 'user===');
    // user = {
    //   id: '105383420233267111111798964',
    //   email: '',
    //   verified_email: true,
    //   name: 'name',
    //   given_name: 'given_name',
    //   family_name: 'family_name',
    //   picture: '',
    //   locale: '',
    // };
    window.portkey_did?.request({
      method: 'portkey_socialLogin',
      params: {
        response: {
          ...response,
          user,
        },
      },
    });
  }, []);

  const onError = useCallback((error: any) => {
    console.log(error, 'onError===LoginSocial');
    window.portkey_did?.request({
      method: 'portkey_socialLogin',
      params: { error: typeof error === 'string' ? error : error?.err || error },
    });
  }, []);

  return (
    <div>
      <>
        {loginType === 'Google' && (
          <LoginSocialGoogle
            // isOnlyGetToken
            // typeResponse="idToken"
            // scope="openid email profile"
            client_id={process.env.NEXT_PUBLIC_GG_APP_ID || ''}
            onLoginStart={() => {
              //
            }}
            onResolve={onSuccess}
            onReject={onError}>
            <Button>LoginSocialGoogle</Button>
          </LoginSocialGoogle>
        )}
        {loginType === 'Apple' && (
          <LoginSocialApple
            client_id={process.env.NEXT_PUBLIC_APP_APPLE_ID || ''}
            scope={'name email'}
            redirect_uri={'https://6bd8-123-113-146-87.jp.ngrok.io/appleAuth'}
            onResolve={onSuccess}
            onReject={onError}>
            {/* <AppleLoginButton /> */}
            <Button>LoginSocialApple</Button>
          </LoginSocialApple>
        )}
        {loginType !== 'Apple' && loginType !== 'Google' && <>NO CONTENT</>}
      </>
    </div>
  );
}
