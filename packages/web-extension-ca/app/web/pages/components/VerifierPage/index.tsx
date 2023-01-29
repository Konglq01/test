import { checkVerificationCode, sendVerificationCode } from '@portkey/api/api-did/apiUtils/verification';
import { Button, message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useCommonState, useLoading } from 'store/Provider/hooks';
import { PasscodeInput } from 'antd-mobile';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { DIGIT_CODE } from '@portkey/constants/misc';
import clsx from 'clsx';
import VerifierPair from 'components/VerifierPair';
import './index.less';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { useTranslation } from 'react-i18next';
import { setUserGuardianSessionIdAction } from '@portkey/store/store-ca/guardians/actions';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { useEffectOnce } from 'react-use';
import { LoginStrType } from '@portkey/store/store-ca/guardians/utils';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';

const MAX_TIMER = 60;

enum VerificationError {
  InvalidCode = 'Invalid code',
  codeExpired = 'The code has expired. Please resend it.',
}

interface VerifierPageProps {
  loginAccount?: LoginInfo;
  currentGuardian?: UserGuardianItem;
  guardianType?: LoginType;
  isInitStatus?: boolean;
  onSuccess?: (res: { verificationDoc: string; signature: string; verifierId: string }) => void;
}

export default function VerifierPage({
  loginAccount,
  currentGuardian,
  guardianType,
  isInitStatus,
  onSuccess,
}: VerifierPageProps) {
  const { setLoading } = useLoading();
  const [timer, setTimer] = useState<number>(0);
  const { isPrompt } = useCommonState();
  const [pinVal, setPinVal] = useState<string>();
  const timerRef = useRef<NodeJS.Timer>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentNetwork = useCurrentNetworkInfo();

  useEffectOnce(() => {
    isInitStatus && setTimer(MAX_TIMER);
  });

  const onFinish = useCallback(
    async (code: string) => {
      try {
        console.log(code);
        if (code && code.length === 6) {
          if (!loginAccount?.guardianAccount) throw 'Missing account!!!';
          if (!currentGuardian?.sessionId) throw 'Missing verifierSessionId!!!';
          setLoading(true);

          const res = await checkVerificationCode({
            baseUrl: currentNetwork.apiUrl,
            guardianAccount: loginAccount.guardianAccount,
            verifierSessionId: currentGuardian.sessionId,
            verificationCode: code,
            endPoint: currentGuardian.verifier?.url || '',
          });

          setLoading(false);
          if (res.signature) return onSuccess?.({ ...res, verifierId: currentGuardian.verifier?.id || '' });

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
    [loginAccount, currentGuardian, setLoading, currentNetwork.apiUrl, onSuccess, t],
  );

  const resendCode = useCallback(async () => {
    if (!currentGuardian?.guardianAccount) return message.error('Missing loginGuardianType');
    if (!guardianType && guardianType !== 0) return message.error('Missing guardiansType');
    setLoading(true);
    const res = await sendVerificationCode({
      guardianAccount: currentGuardian.guardianAccount,
      type: LoginStrType[guardianType],
      baseUrl: currentGuardian?.verifier?.url || '',
      id: currentGuardian.verifier?.id || '',
    });
    setLoading(false);
    if (res.verifierSessionId) {
      setTimer(MAX_TIMER);
      dispatch(
        setUserGuardianSessionIdAction({
          key: currentGuardian?.key ?? `${currentGuardian?.guardianAccount}&${currentGuardian?.verifier?.name}`,
          sessionId: res.verifierSessionId,
        }),
      );
    }
  }, [currentGuardian, dispatch, guardianType, setLoading]);

  useEffect(() => {
    if (timer !== MAX_TIMER) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        const newTime = t - 1;
        if (newTime <= 0) {
          timerRef.current && clearInterval(timerRef.current);
          timerRef.current = undefined;
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [timer]);

  return (
    <div className={clsx('verifier-page-wrapper', isPrompt || 'popup-page')}>
      {currentGuardian?.isLoginAccount && <div className="login-icon">{t('Login Account')}</div>}
      <div className="flex-row-center login-account-wrapper">
        <VerifierPair guardianType={currentGuardian?.guardianType} verifierSrc={currentGuardian?.verifier?.imageUrl} />
        <span className="login-account">{currentGuardian?.guardianAccount || ''}</span>
      </div>
      <div className="send-tip">
        {isPrompt || 'Please contact your guardians, and enter '}
        {t('sendCodeTip1', { codeCount: DIGIT_CODE.length })}&nbsp;
        <span className="account">{currentGuardian?.guardianAccount}</span>
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
