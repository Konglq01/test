import { useNavigate } from 'react-router';
import VerifierPage from 'pages/components/VerifierPage';
import { useAppDispatch, useLoginInfo, useGuardiansInfo, useCommonState } from 'store/Provider/hooks';
import { useCallback, useMemo } from 'react';
import { message } from 'antd';
import { setUserGuardianItemStatus } from '@portkey/store/store-ca/guardians/actions';
import { VerificationType, VerifyStatus } from '@portkey/types/verifier';
import './index.less';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import clsx from 'clsx';
import SettingHeader from 'pages/components/SettingHeader';
import useLocationState from 'hooks/useLocationState';

export default function VerifierAccount() {
  const { loginAccount } = useLoginInfo();
  const { currentGuardian } = useGuardiansInfo();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state } = useLocationState<'register' | 'login' | 'guardians'>();
  const { isPrompt } = useCommonState();
  // const isPrompt = false;
  const verificationType = useMemo(() => {
    switch (state) {
      case 'register':
        return VerificationType.register;
      case 'login':
        return VerificationType.communityRecovery;
      case 'guardians':
        return VerificationType.addGuardian;
      default:
        message.error('Router state error', 2000, () => navigate(-1));
        return 0;
    }
  }, [navigate, state]);

  console.log(state, 'location==');

  const onSuccess = useCallback(() => {
    if (state === 'register') {
      navigate('/register/set-pin', { state: 'register' });
    } else if (state == 'login') {
      if (!currentGuardian) return;
      dispatch(
        setUserGuardianItemStatus({
          key: currentGuardian.key,
          status: VerifyStatus.Verified,
        }),
      );
      navigate('/login/guardian-approval');
    } else if (state?.indexOf('guardians') !== -1) {
      navigate('/setting/guardians/guardian-approval', { state: state });
    } else {
      message.error('Router state error');
    }
  }, [dispatch, navigate, state, currentGuardian]);

  return (
    <div className={clsx('verifier-account-wrapper', isPrompt ? 'common-page' : 'popup-page')}>
      {isPrompt ? (
        <PortKeyTitle
          leftElement
          leftCallBack={() => {
            state === 'register' && navigate('/register/select-verifier');
            state === 'login' && navigate('/login/guardian-approval');
            state?.indexOf('guardians') !== -1 && navigate(`/setting/${state}`, { state: { back: 'back' } });
          }}
        />
      ) : (
        <SettingHeader
          leftCallBack={() => {
            state === 'register' && navigate('/register/select-verifier');
            state === 'login' && navigate('/login/guardian-approval');
            state?.indexOf('guardians') !== -1 && navigate(`/setting/${state}`, { state: { back: 'back' } });
          }}
        />
      )}
      <div className="common-content1 verifier-account-content">
        <VerifierPage
          loginAccount={loginAccount}
          currentGuardian={currentGuardian}
          verificationType={verificationType}
          guardiansType={loginAccount?.accountLoginType}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
