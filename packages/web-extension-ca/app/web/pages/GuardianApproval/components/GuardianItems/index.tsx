import { sendVerificationCode } from '@portkey/api/apiUtils/verification';
import { setCurrentGuardianAction, setUserGuardianItemStatus } from '@portkey/store/store-ca/guardians/actions';
import { UserGuardianItem, UserGuardianStatus } from '@portkey/store/store-ca/guardians/type';
import { LoginStrType } from '@portkey/store/store-ca/guardians/utils';
import { VerifyStatus } from '@portkey/types/verifier';
import { Button, message } from 'antd';
import clsx from 'clsx';
import VerifierPair from 'components/VerifierPair';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { LoginInfo } from 'store/reducers/loginCache/type';

interface GuardianItemProps {
  disabled?: boolean;
  isExpired?: boolean;
  item: UserGuardianStatus;
  loginAccount?: LoginInfo;
}
export default function GuardianItems({ disabled, item, isExpired, loginAccount }: GuardianItemProps) {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { state } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const guardianSendCode = useCallback(
    async (item: UserGuardianItem) => {
      try {
        setLoading(true);
        dispatch(
          setLoginAccountAction({
            guardianAccount: item.guardianAccount,
            loginType: item.guardianType,
          }),
        );
        const result = await sendVerificationCode({
          guardianAccount: item?.guardianAccount,
          type: LoginStrType[item.guardianType],
          baseUrl: item?.verifier?.url || '',
          verifierName: item?.verifier?.name || '',
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(setCurrentGuardianAction({ ...item, sessionId: result.verifierSessionId, isInitStatus: true }));
          dispatch(
            setUserGuardianItemStatus({
              key: item.key,
              status: VerifyStatus.Verifying,
            }),
          );
          navigate('/setting/guardians/verifier-account', { state: state });
        }
      } catch (error: any) {
        console.log('---guardian-sendCode-error', error);
        setLoading(false);
        message.error(error?.Error?.Message || error.message?.Message || error?.message);
      }
    },
    [state, dispatch, navigate, setLoading],
  );

  const SendCode = useCallback(
    async (item: UserGuardianItem) => {
      try {
        if (state && state.indexOf('guardians') !== -1) {
          guardianSendCode(item);
          return;
        }
        if (!loginAccount || !LoginStrType[loginAccount.loginType] || !loginAccount.guardianAccount)
          return message.error(
            'User registration information is invalid, please fill in the registration method again',
          );
        setLoading(true);
        const result = await sendVerificationCode({
          guardianAccount: item?.guardianAccount,
          type: LoginStrType[loginAccount.loginType],
          baseUrl: item?.verifier?.url || '',
          verifierName: item.verifier?.name || '',
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(setCurrentGuardianAction({ ...item, sessionId: result.verifierSessionId, isInitStatus: true }));
          dispatch(
            setUserGuardianItemStatus({
              key: item.key,
              status: VerifyStatus.Verifying,
            }),
          );
          navigate('/login/verifier-account', { state: 'login' });
        }
      } catch (error: any) {
        console.log(error, 'error===');
        setLoading(false);
        message.error(error?.error?.message ?? error?.type ?? 'Something error');
      }
    },
    [state, loginAccount, setLoading, guardianSendCode, dispatch, navigate],
  );

  const verifyingHandler = useCallback(
    async (item: UserGuardianItem) => {
      dispatch(setCurrentGuardianAction({ ...item, isInitStatus: false }));
      state && state.indexOf('guardians') !== -1
        ? navigate('/setting/guardians/verifier-account', { state: state })
        : navigate('/login/verifier-account', { state: 'login' });
    },
    [dispatch, navigate, state],
  );

  return (
    <li className={clsx('flex-between-center verifier-item', disabled && 'verifier-item-disabled')}>
      {item.isLoginAccount && <div className="login-icon">{t('Login Account')}</div>}
      <div className="flex-between-center">
        <VerifierPair guardianType={item.guardianType} verifierSrc={item.verifier?.imageUrl} />
        <span className="account-text">{item.guardianAccount}</span>
      </div>
      {isExpired && item.status !== VerifyStatus.Verified ? (
        <Button className="expired" type="text" disabled>
          {t('Expired')}
        </Button>
      ) : (
        <>
          {(!item.status || item.status === VerifyStatus.NotVerified) && (
            <Button className="not-verified" type="primary" onClick={() => SendCode(item)}>
              {t('Send')}
            </Button>
          )}
          {item.status === VerifyStatus.Verifying && (
            <Button type="primary" className="verifying" onClick={() => verifyingHandler(item)}>
              {t('Verify')}
            </Button>
          )}
          {item.status === VerifyStatus.Verified && (
            <Button className="verified" type="text" disabled>
              {t('Confirmed')}
            </Button>
          )}
        </>
      )}
    </li>
  );
}
