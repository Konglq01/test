import { checkVerificationCode, sendVerificationCode } from '@portkey/api/apiUtils/verification';
import { sleep } from '@portkey/utils';
import { Button, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useCommonState, useLoading } from 'store/Provider/hooks';
import { PasscodeInput } from 'antd-mobile';
import { loginInfo } from 'store/reducers/loginCache/type';
import { VerificationType } from '@portkey/types/verifier';
import { DIGIT_CODE } from '@portkey/constants/misc';
import clsx from 'clsx';
import VerifierPair from 'components/VerifierPair';
import './index.less';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { useTranslation } from 'react-i18next';
import { setUserGuardianSessionIdAction } from '@portkey/store/store-ca/guardians/actions';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import { LoginType } from '@portkey/types/types-ca/wallet';
import useLocationState from 'hooks/useLocationState';

const MAX_TIMER = 60;

enum VerificationError {
  InvalidCode = 'Invalid code',
  codeExpired = 'The code has expired. Please resend it.',
}

interface VerifierPageProps {
  loginAccount?: loginInfo;
  currentGuardian?: UserGuardianItem;
  guardiansType?: LoginType;
  verificationType: VerificationType;

  onSuccess?: (res: any) => void;
}

export default function VerifierPage({
  loginAccount,
  currentGuardian,
  guardiansType,
  verificationType,
  onSuccess,
}: VerifierPageProps) {
  const { setLoading } = useLoading();
  const [timer, setTimer] = useState<number | undefined>();
  const { isPrompt } = useCommonState();
  const [pinVal, setPinVal] = useState<string>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { state } = useLocationState<'guardians/add' | 'guardians/edit'>();

  const onFinish = useCallback(
    async (code: string) => {
      try {
        console.log(code);
        if (code && code.length === 6) {
          if (
            !loginAccount?.loginGuardianType ||
            (!loginAccount.accountLoginType && loginAccount.accountLoginType !== 0)
          )
            throw 'Missing account!!!';
          if (!currentGuardian?.sessionId) throw 'Missing verifierSessionId!!!';
          setLoading(true);

          const res = await checkVerificationCode({
            code,
            baseUrl: currentGuardian?.verifier?.url || '',
            verificationType,
            type: loginAccount.accountLoginType,
            loginGuardianType: loginAccount?.loginGuardianType,
            verifierSessionId: currentGuardian?.sessionId,
          });
          setLoading(false);
          if (state && state.indexOf('guardians') !== -1) {
            if (Object.keys(res).length) return onSuccess?.(res);
          } else {
            if (!Object.keys(res).length) return onSuccess?.(res);
          }
          if (res?.error?.message) {
            message.error(t(res.error.message));
          } else {
            message.error(t(VerificationError.InvalidCode));
          }
          setPinVal('');
        }
      } catch (error: any) {
        console.log(error, 'error====');
        setLoading(false);
        setPinVal('');
        const _error = verifyErrorHandler(error);
        message.error(_error);
      }
    },
    [
      loginAccount?.loginGuardianType,
      loginAccount?.accountLoginType,
      currentGuardian?.sessionId,
      currentGuardian?.verifier?.url,
      setLoading,
      verificationType,
      state,
      onSuccess,
      t,
    ],
  );

  const resendCode = useCallback(async () => {
    if (!loginAccount?.loginGuardianType) return message.error('Missing loginGuardianType');
    console.log(guardiansType, 'guardiansType===');
    if (!guardiansType && guardiansType !== 0) return message.error('Missing guardiansType');
    setLoading(true);
    const res = await sendVerificationCode({
      loginGuardianType: loginAccount.loginGuardianType,
      guardiansType,
      verificationType,
      baseUrl: currentGuardian?.verifier?.url || '',
      managerUniqueId: loginAccount.managerUniqueId,
    });
    setLoading(false);
    if (res.verifierSessionId) {
      setTimer(MAX_TIMER);
      dispatch(
        setUserGuardianSessionIdAction({
          key: currentGuardian?.key ?? `${currentGuardian?.loginGuardianType}&${currentGuardian?.verifier?.name}`,
          sessionId: res.verifierSessionId,
        }),
      );
    }
  }, [currentGuardian, dispatch, guardiansType, loginAccount, setLoading, verificationType]);

  const timerUtil = useCallback(async () => {
    if (!timer) return setTimer(undefined);
    await sleep(1000);
    setTimer((v) => (v ? --v : v));
    timerUtil();
  }, [timer]);

  useEffect(() => {
    if (timer !== MAX_TIMER) return;
    timerUtil();
  }, [timer, timerUtil]);

  return (
    <div className={clsx('verifier-page-wrapper', isPrompt || 'popup-page')}>
      <div className="login-icon">{t('Login Account')}</div>
      <div className="flex-row-center login-account-wrapper">
        <VerifierPair
          guardiansType={currentGuardian?.guardiansType}
          verifierSrc={currentGuardian?.verifier?.imageUrl}
        />
        <span className="login-account">{loginAccount?.loginGuardianType || ''}</span>
      </div>
      <div className="send-tip">
        {isPrompt || 'Please contact your guardians, and enter '}
        {t('sendCodeTip1', { codeCount: DIGIT_CODE.length })}&nbsp;
        <span className="account">{loginAccount?.loginGuardianType}</span>
        <br />
        {t('sendCodeTip2', { minute: DIGIT_CODE.expiration })}
      </div>
      <div className="password-wrapper">
        <PasscodeInput
          value={pinVal}
          length={DIGIT_CODE.length}
          seperated
          plain
          onChange={(v) => setPinVal(v)}
          onFill={onFinish}
        />
        <Button
          type="text"
          disabled={!!timer}
          onClick={resendCode}
          className={clsx('text-center resend-btn', timer && 'resend-after-btn')}>
          {timer ? t('Resend after', { timer }) : t('Resend')}
        </Button>
      </div>
    </div>
  );
}
