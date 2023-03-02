import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ThreeWayLogin } from '@portkey/types/types-ca/wallet';
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

// import {
//   FacebookLoginButton,
//   GoogleLoginButton,
//   GithubLoginButton,
//   AmazonLoginButton,
//   InstagramLoginButton,
//   LinkedInLoginButton,
//   MicrosoftLoginButton,
//   TwitterLoginButton,
//   AppleLoginButton,
// } from 'react-social-login-buttons';

export default function SocialTem({ loginType }: { loginType: ThreeWayLogin }) {
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState<any>();
  const [open, setOpen] = useState<boolean>(true);

  const onSuccess = useCallback((response: IResolveParams) => {
    //
    window.portkey_ca?.request({
      method: 'portkey_loginByThreeWay',
      params: { response },
    });
  }, []);

  const onError = useCallback((error: any) => {
    window.portkey_ca?.request({
      method: 'portkey_loginByThreeWay',
      params: { error },
    });
  }, []);
  return (
    <div>
      <Button onClick={() => setOpen(v => !v)}>setOpen</Button>
      {open && (
        <>
          <LoginSocialGoogle
            isOnlyGetToken
            client_id={process.env.NEXT_PUBLIC_GG_APP_ID || ''}
            onResolve={({ provider, data }) => {
              onSuccess({ provider, data });
              console.log(provider, data, 'onResolve===LoginSocialGoogle');
            }}
            onReject={err => {
              console.log(err);
              onError(err);
            }}>
            <Button>LoginSocialGoogle</Button>
          </LoginSocialGoogle>

          <LoginSocialApple
            client_id={process.env.NEXT_PUBLIC_APP_APPLE_ID || ''}
            scope={'name email'}
            redirect_uri={'https://6bd8-123-113-146-87.jp.ngrok.io/appleAuth'}
            onResolve={({ provider, data }) => {
              setProvider(provider);
              setProfile(data);
              onSuccess({ provider, data });
              console.log(provider, data, 'onResolve===LoginSocialApple');
            }}
            onReject={err => {
              console.log(err);
              onError(err);
            }}>
            {/* <AppleLoginButton /> */}
            <Button>LoginSocialApple</Button>
          </LoginSocialApple>
        </>
      )}
    </div>
  );
}
