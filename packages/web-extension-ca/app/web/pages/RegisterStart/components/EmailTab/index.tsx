import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { handleErrorCode, handleErrorMessage } from '@portkey-wallet/utils';
import { EmailError } from '@portkey-wallet/utils/check';
import { Button } from 'antd';
import i18n from 'i18n';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RegisterType } from 'types/wallet';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import EmailInput, { EmailInputInstance } from '../EmailInput';

interface EmailTabProps {
  type: RegisterType;
  onFinish?: (email: string) => void;
}

export default function EmailTab({ type, onFinish }: EmailTabProps) {
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();
  const [val, setVal] = useState<string>();
  const [error, setError] = useState<string>();
  const { t } = useTranslation();
  const emailInputInstance = useRef<EmailInputInstance>();
  const onClick = useCallback(async () => {
    try {
      await emailInputInstance?.current?.validateEmail(val);
      val && onFinish?.(val);
    } catch (error: any) {
      setError(error);
    }
  }, [onFinish, val]);

  const validateEmail = useCallback(
    async (email?: string, type?: RegisterType | undefined) => {
      //
      if (!currentChain) throw 'Could not find chain information';
      let isHasAccount = false;
      try {
        const checkResult = await getHolderInfo({
          rpcUrl: currentChain.endPoint,
          address: currentChain.caContractAddress,
          chainType: currentNetwork.walletType,
          paramsOption: {
            guardianIdentifier: email as string,
          },
        });
        if (checkResult.guardianList?.guardians?.length > 0) {
          isHasAccount = true;
        }
      } catch (error: any) {
        const code = handleErrorCode(error);
        if (code?.toString === '3002') {
          isHasAccount = false;
        } else {
          throw handleErrorMessage(error || 'GetHolderInfo error');
        }
      }

      if (type === 'signUp') {
        if (isHasAccount) throw i18n.t(EmailError.alreadyRegistered);
      } else {
        if (!isHasAccount) throw i18n.t(EmailError.noAccount);
      }
    },
    [currentChain, currentNetwork.walletType],
  );

  return (
    <div className="email-sign-wrapper">
      <EmailInput
        val={val}
        ref={emailInputInstance}
        validate={validateEmail}
        error={error}
        onChange={(v) => {
          setError(undefined);
          setVal(v);
        }}
      />
      <Button className="login-primary-btn" type="primary" disabled={!val || !!error} onClick={onClick}>
        {type === 'signUp' ? t('Sign Up') : t('Login')}
      </Button>
    </div>
  );
}
