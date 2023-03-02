import { Button } from 'antd';
import { useCallback, useRef, useState } from 'react';
import EmailInput, { EmailInputInstance } from 'pages/RegisterStart/components/EmailInput';
import { useTranslation } from 'react-i18next';
import './index.less';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';

interface EmailTabProps {
  onSuccess: (email: string) => void;
  currentNetwork: NetworkItem;
  isTermsChecked?: boolean;
  currentChain?: ChainItemType;
}

export default function EmailTab({ currentNetwork, currentChain, onSuccess }: EmailTabProps) {
  const [error, setError] = useState<string>();
  const [val, setVal] = useState<string>();
  const emailInputInstance = useRef<EmailInputInstance>();
  const { t } = useTranslation();

  const onSignUp = useCallback(async () => {
    try {
      await emailInputInstance?.current?.validateEmail(val, 'registered');
      val && onSuccess(val);
    } catch (error: any) {
      setError(error);
    }
  }, [onSuccess, val]);

  return (
    <div className="email-sign-wrapper">
      <EmailInput
        currentNetwork={currentNetwork}
        currentChain={currentChain}
        val={val}
        ref={emailInputInstance}
        error={error}
        onChange={(v) => {
          setError(undefined);
          setVal(v);
        }}
      />
      <Button className="login-primary-btn" type="primary" disabled={!val || !!error} onClick={onSignUp}>
        {t('Sign Up')}
      </Button>
    </div>
  );
}
