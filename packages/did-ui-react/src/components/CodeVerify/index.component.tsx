import { Button } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PasscodeInput } from 'antd-mobile';
import { DIGIT_CODE } from '@portkey/constants/misc';
import clsx from 'clsx';
import VerifierPair from '../VerifierPair';
import { VerifierItem } from '@portkey/types/verifier';
import { useTranslation } from 'react-i18next';
import { errorTip, verifyErrorHandler } from '../../utils/errorHandler';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { useEffectOnce } from 'react-use';
import { setLoading } from '../../utils/loading';
import { checkVerificationCode } from '@portkey/api/api-did/utils/verification';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { OnErrorFunc } from '../../types/error';
import { verification } from '../config-provider/api';
import './index.less';

const MAX_TIMER = 60;

enum VerificationError {
  InvalidCode = 'Invalid code',
  codeExpired = 'The code has expired. Please resend it.',
}

export interface CodeVerifyProps {
  serviceUrl: string;
  verifier: VerifierItem;
  className?: string;
  loginType?: LoginType;
  isCountdownNow?: boolean;
  isLoginAccount?: boolean;
  guardianAccount: string;
  verifierSessionId: string;
  isErrorTip?: boolean;
  onError?: OnErrorFunc;
  onSuccess?: (res: { verificationDoc: string; signature: string; verifierId: string }) => void;
}

export default function CodeVerify({
  verifier,
  className,
  serviceUrl,
  isErrorTip,
  isCountdownNow,
  isLoginAccount,
  guardianAccount,
  loginType = LoginType.email,
  verifierSessionId,
  onError,
  onSuccess,
}: CodeVerifyProps) {
  const [timer, setTimer] = useState<number>(0);
  const [pinVal, setPinVal] = useState<string>();
  const timerRef = useRef<NodeJS.Timer>();
  const { t } = useTranslation();

  useEffectOnce(() => {
    isCountdownNow && setTimer(MAX_TIMER);
  });

  const onFinish = useCallback(
    async (code: string) => {
      try {
        console.log(code);
        if (code && code.length === 6) {
          if (!verifierSessionId) throw 'Missing verifierSessionId!!!';
          setLoading(true);

          const res = await checkVerificationCode({
            baseUrl: serviceUrl,
            guardianAccount,
            verifierSessionId: verifierSessionId,
            verificationCode: code,
            verifierId: verifier.id,
            chainId: DefaultChainId,
          });
          setLoading(false);

          if (res.signature) return onSuccess?.({ ...res, verifierId: verifier?.id || '' });

          if (res?.error?.message) {
            errorTip(
              {
                errorFields: 'CodeVerify',
                error: res.error.message,
              },
              isErrorTip,
              onError,
            );
          } else {
            errorTip(
              {
                errorFields: 'CodeVerify',
                error: VerificationError.InvalidCode,
              },
              isErrorTip,
              onError,
            );
          }
          setPinVal('');
        }
      } catch (error: any) {
        setLoading(false);
        setPinVal('');
        const _error = verifyErrorHandler(error);
        errorTip(
          {
            errorFields: 'CodeVerify',
            error: _error,
          },
          isErrorTip,
          onError,
        );
      }
    },

    [verifierSessionId, serviceUrl, guardianAccount, verifier.id, onSuccess, isErrorTip, onError],
  );

  const resendCode = useCallback(async () => {
    try {
      if (!guardianAccount) throw 'Missing loginGuardianType';
      if (!LoginStrType[loginType]) throw 'Missing guardiansType';
      setLoading(true);
      const res = await verification.sendVerificationCode({
        baseURL: serviceUrl,
        params: {
          guardianAccount,
          type: LoginStrType[loginType],
          verifierId: verifier.id,
          chainId: DefaultChainId,
        },
      });
      setLoading(false);
      if (res.verifierSessionId) {
        setTimer(MAX_TIMER);
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error, 'verifyHandler');
      const _error = verifyErrorHandler(error);
      errorTip(
        {
          errorFields: 'CodeVerify',
          error: _error,
        },
        isErrorTip,
        onError,
      );
    }
  }, [guardianAccount, isErrorTip, loginType, onError, serviceUrl, verifier.id]);

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
    <div className={clsx('verifier-account-wrapper', className)}>
      {isLoginAccount && <div className="login-icon">{t('Login Account')}</div>}
      <div className="flex-row-center login-account-wrapper">
        <VerifierPair guardianType={loginType} verifierSrc={verifier.imageUrl} />
        <span className="login-account">{guardianAccount || ''}</span>
      </div>
      <div className="send-tip">
        {`A ${DIGIT_CODE.length}-digit code was sent to`}
        <span className="account">{guardianAccount}</span>
        <br />
        {`Enter it within ${DIGIT_CODE.expiration} minutes`}
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
          {timer ? `Resend after ${timer}s` : t('Resend')}
        </Button>
      </div>
    </div>
  );
}
