import { setCurrentGuardianAction, setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import { Button, message } from 'antd';
import clsx from 'clsx';
import VerifierPair from 'components/VerifierPair';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import { verification } from 'utils/api';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useVerifyToken } from 'hooks/authentication';

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

  const isSocialLogin = useMemo(
    () => item.guardianType === LoginType.Google || item.guardianType === LoginType.Apple,
    [item.guardianType],
  );

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
        const result = await verification.sendVerificationCode({
          params: {
            guardianIdentifier: item?.guardianAccount,
            type: LoginType[item.guardianType],
            verifierId: item?.verifier?.id || '',
            chainId: DefaultChainId,
          },
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(
            setCurrentGuardianAction({
              ...item,
              verifierInfo: {
                sessionId: result.verifierSessionId,
                endPoint: result.endPoint,
              },
              isInitStatus: true,
            }),
          );
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
        message.error(verifyErrorHandler(error));
      }
    },
    [setLoading, dispatch, navigate, state],
  );

  const SendCode = useCallback(
    async (item: UserGuardianItem) => {
      console.log(item, 'guardianSendCode===');

      try {
        if (state && state.indexOf('guardians') !== -1) {
          guardianSendCode(item);
          return;
        }
        if (!loginAccount || !LoginType[loginAccount.loginType] || !loginAccount.guardianAccount)
          return message.error(
            'User registration information is invalid, please fill in the registration method again',
          );
        setLoading(true);
        const result = await verification.sendVerificationCode({
          params: {
            guardianIdentifier: item?.guardianAccount,
            type: LoginType[item.guardianType],
            verifierId: item.verifier?.id || '',
            chainId: DefaultChainId,
          },
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(
            setCurrentGuardianAction({
              ...item,
              verifierInfo: {
                sessionId: result.verifierSessionId,
                endPoint: result.endPoint,
              },
              isInitStatus: true,
            }),
          );
          dispatch(
            setUserGuardianItemStatus({
              key: item.key,
              status: VerifyStatus.Verifying,
            }),
          );
          if (state && state.indexOf('removeManage') !== -1) {
            navigate('/setting/wallet-security/manage-devices/verifier-account', { state: state });
          } else {
            navigate('/login/verifier-account', { state: 'login' });
          }
        }
      } catch (error: any) {
        console.log(error, 'error===');
        setLoading(false);
        const _error = verifyErrorHandler(error);
        message.error(_error);
      }
    },
    [state, loginAccount, setLoading, guardianSendCode, dispatch, navigate],
  );

  const verifyToken = useVerifyToken();

  const socialVerifyHandler = useCallback(
    async (item: UserGuardianItem) => {
      try {
        setLoading(true);
        const result = await verifyToken(item.guardianType, {
          id: item.guardianAccount,
          verifierId: item.verifier?.id,
          chainId: DefaultChainId,
        });
        const verifierInfo: VerifierInfo = { ...result, verifierId: item?.verifier?.id };
        dispatch(
          setUserGuardianItemStatus({
            key: item.key,
            signature: verifierInfo.signature,
            verificationDoc: verifierInfo.verificationDoc,
            status: VerifyStatus.Verified,
          }),
        );
      } catch (error) {
        const msg = handleErrorMessage(error);
        message.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, setLoading, verifyToken],
  );

  const verifyingHandler = useCallback(
    async (item: UserGuardianItem) => {
      if (isSocialLogin) return socialVerifyHandler(item);
      dispatch(setCurrentGuardianAction({ ...item, isInitStatus: false }));
      if (state?.indexOf('guardians') !== -1) {
        navigate('/setting/guardians/verifier-account', { state: state });
      } else if (state?.indexOf('removeManage') !== -1) {
        navigate('/setting/wallet-security/manage-devices/verifier-account', { state: state });
      } else {
        navigate('/login/verifier-account', { state: 'login' });
      }
    },
    [dispatch, isSocialLogin, navigate, socialVerifyHandler, state],
  );

  const accountShow = useCallback((guardian: UserGuardianItem) => {
    switch (guardian.guardianType) {
      case LoginType.Email:
        return <div className="account-text">{guardian.guardianAccount}</div>;
      case LoginType.Phone:
        return <div className="account-text">{`+${guardian.guardianAccount}`}</div>;
      case LoginType.Google:
        return (
          <div className="account-text">
            <div className="name">{guardian.firstName}</div>
            <div className="detail">{guardian.thirdPartyEmail}</div>
          </div>
        );
      case LoginType.Apple:
        return (
          <div className="account-text">
            <div className="name">{guardian.firstName}</div>
            <div className="detail">{guardian.isPrivate ? '******' : guardian.thirdPartyEmail}</div>
          </div>
        );
    }
  }, []);

  return (
    <li className={clsx('flex-between-center verifier-item', disabled && 'verifier-item-disabled')}>
      {item.isLoginAccount && <div className="login-icon">{t('Login Account')}</div>}
      <div className="flex-between-center">
        <VerifierPair
          guardianType={item.guardianType}
          verifierSrc={item.verifier?.imageUrl}
          verifierName={item?.verifier?.name}
        />
        {accountShow(item)}
      </div>
      {isExpired && item.status !== VerifyStatus.Verified ? (
        <Button className="expired" type="text" disabled>
          {t('Expired')}
        </Button>
      ) : (
        <>
          {(!item.status || item.status === VerifyStatus.NotVerified) && !isSocialLogin && (
            <Button className="not-verified" type="primary" onClick={() => SendCode(item)}>
              {t('Send')}
            </Button>
          )}
          {(item.status === VerifyStatus.Verifying || (!item.status && isSocialLogin)) && (
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
