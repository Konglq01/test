import React, { useCallback } from 'react';
import EmailTab from '../EmailTab';
import { useTranslation } from 'react-i18next';
import CustomSvg from '../CustomSvg';
import './index.less';

export interface SignUpBaseProps {
  onBack?: () => void;
  inputValidator?: (value?: string) => Promise<any>;
  onSignUp?: (value: string) => void;
}

export default function SignUpBase({ onBack, inputValidator, onSignUp }: SignUpBaseProps) {
  const { t } = useTranslation();

  const _inputValidator = useCallback(async (v?: string) => inputValidator?.(v), [inputValidator]);

  return (
    <div className="sign-ui-card">
      <h2 className="sign-title">
        <CustomSvg type="BackLeft" onClick={onBack} />
        <span>{t('Sign Up')}</span>
      </h2>
      <div className="sign-content">
        <EmailTab inputValidator={_inputValidator} onSuccess={onSignUp} />
      </div>
    </div>
  );
}
