import { useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { Button, Image } from 'antd';
import type { IResolveParams } from 'reactjs-social-login';
import styles from './styles.module.less';
import { PortkeyLogo, Google, Apple } from 'assets/images';

const _LoginSocialGoogle = import('reactjs-social-login').then(i => i.LoginSocialGoogle);
const _LoginSocialApple = import('reactjs-social-login').then(i => i.LoginSocialApple);

const LoginSocialGoogle = dynamic(_LoginSocialGoogle, { ssr: false });
const LoginSocialApple = dynamic(_LoginSocialApple, { ssr: false });

const SUPPORT_TYPE = ['Google', 'Apple'];

export default function SocialTem({ loginType }: { loginType: ISocialLogin }) {
  const onSuccess = useCallback(async (response: IResolveParams) => {
    console.log(response, 'response====');
    window.portkey_did?.request({
      method: 'portkey_socialLogin',
      params: {
        response,
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
    <div className={styles['social-login-wrapper']}>
      <div className={styles['social-login-inner']}>
        {SUPPORT_TYPE.includes(loginType) ? (
          <>
            <img className={styles['portkey-logo']} src={PortkeyLogo.src} />

            <p className={styles['description']}>{`Click below to join Portkey using your ${loginType} account`}</p>

            {loginType === 'Google' && (
              <LoginSocialGoogle
                isOnlyGetToken
                // typeResponse="idToken"
                // scope="openid email profile"
                client_id={process.env.NEXT_PUBLIC_GG_APP_ID || ''}
                onLoginStart={() => {
                  //
                }}
                onResolve={onSuccess}
                onReject={onError}>
                <Button className={styles['common-btn']}>
                  <img className={styles['btn-logo']} src={Google.src} />
                  Join with Google
                </Button>
              </LoginSocialGoogle>
            )}

            {loginType === 'Apple' && (
              <LoginSocialApple
                client_id={process.env.NEXT_PUBLIC_APP_APPLE_ID || ''}
                scope={'name email'}
                redirect_uri={'https://6bd8-123-113-146-87.jp.ngrok.io/appleAuth'}
                onResolve={onSuccess}
                onReject={onError}>
                <Button className={styles['common-btn']}>
                  <img className={styles['btn-logo']} src={Apple.src} />
                  Join with Apple
                </Button>
              </LoginSocialApple>
            )}
          </>
        ) : (
          <>NO CONTENT</>
        )}
      </div>
    </div>
  );
}
