import { checkVerificationCode, sendVerificationCode } from '@portkey/api/apiUtils/verification';
import { sleep } from '@portkey/utils';
import { Button, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import { PasscodeInput } from 'antd-mobile';
import { loginInfo } from '@portkey/store/store-ca/login/type';
import { LoginType, VerificationType } from '@portkey/types/verifier';
import { DIGIT_CODE } from '@portkey/constants/misc';
import clsx from 'clsx';
import VerifierPair from 'components/VerifierPair';
import './index.less';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { useTranslation } from 'react-i18next';

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
  onSuccess?: () => void;
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
  // const isPrompt = false;
  console.log(pinVal, 'loginAccount===');

  const onFinish = useCallback(
    async (code: string) => {
      console.log(code);
      if (code && code.length === 6) {
        if (!loginAccount?.loginGuardianType || (!loginAccount.accountLoginType && loginAccount.accountLoginType !== 0))
          return message.error('Missing account!!!');
        setLoading(true);
        // TODO
        await sleep(1000);
        const res = await checkVerificationCode({
          code,
          baseUrl: currentGuardian?.verifier?.url || '',
          verificationType,
          type: loginAccount.accountLoginType,
          loginGuardianType: loginAccount?.loginGuardianType,
        });
        setLoading(false);
        if (res.result === 0) return onSuccess?.();
        if (res.result === 2) message.error(t(VerificationError.codeExpired));
        if (!res?.result || res.result === 1) message.error(t(VerificationError.InvalidCode));
        setPinVal('');
      }
    },
    [loginAccount, currentGuardian?.verifier?.url, verificationType, setLoading, onSuccess, t],
  );

  const resendCode = useCallback(async () => {
    if (!loginAccount?.loginGuardianType) return message.error('Missing loginGuardianType');
    console.log(guardiansType, 'guardiansType===');
    if (!guardiansType && guardiansType !== 0) return message.error('Missing guardiansType');
    const res = await sendVerificationCode({
      loginGuardianType: loginAccount.loginGuardianType,
      guardiansType,
      verificationType,
      baseUrl: currentGuardian?.verifier?.url || '',
    });
    if (res) {
      if (res.result === 0) {
        setTimer(MAX_TIMER);
      }
    }
  }, [currentGuardian, guardiansType, loginAccount, verificationType]);

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
