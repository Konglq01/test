import { EmailReg } from '@portkey/utils/reg';
import { Input } from 'antd';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import clsx from 'clsx';
import './index.less';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import { NetworkItem } from '@portkey/constants/constants-ca/network';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { ChainItemType } from '@portkey/store/store-ca/wallet/type';

enum EmailError {
  noEmail = 'Please enter Email address',
  invalidEmail = 'Invalid email address',
  alreadyRegistered = 'This address is already registered',
  noAccount = 'Failed to log in with this email. Please use your login account.',
}

interface EmailInputProps {
  currentNetwork: NetworkItem;
  currentChain?: ChainItemType;
  wrapperClassName?: string;
  error?: string;
  val?: string;
  onChange?: (val: string) => void;
}

export interface EmailInputInstance {
  validateEmail: (email?: string, type?: 'login' | 'registered') => Promise<void>;
}

const EmailInput = forwardRef(
  ({ error, val, wrapperClassName, currentChain, currentNetwork, onChange }: EmailInputProps, ref) => {
    const { t } = useTranslation();

    const validateEmail = useCallback(
      async (email?: string, type?: 'login' | 'registered') => {
        if (!email) throw i18n.t(EmailError.noEmail);
        if (!EmailReg.test(email)) throw i18n.t(EmailError.invalidEmail);
        if (!currentChain) throw 'Could not find chain information';
        let isHasAccount = false;
        try {
          const checkResult = await getHolderInfo({
            rpcUrl: currentChain.endPoint,
            address: currentChain.caContractAddress,
            chainType: currentNetwork.walletType,
            paramsOption: {
              loginGuardianType: email,
            },
          });
          if (checkResult.result.guardiansInfo?.guardians?.length > 0) {
            isHasAccount = true;
          }
        } catch (error: any) {
          console.log(error, 'validateEmail===');
          if (error?.Error?.Details && error?.Error?.Details?.indexOf('Not found ca_hash')) {
            isHasAccount = false;
          } else {
            throw error?.Error?.Message || error.message?.Message || error?.message;
          }
        }

        if (type === 'registered') {
          if (isHasAccount) throw i18n.t(EmailError.alreadyRegistered);
        } else {
          if (!isHasAccount) throw i18n.t(EmailError.noAccount);
        }
      },
      [currentChain, currentNetwork],
    );

    useImperativeHandle(ref, () => ({ validateEmail }));

    return (
      <div className={clsx('email-input-wrapper', wrapperClassName)}>
        <div className="input-label">Email</div>
        <div className="input-wrapper">
          <Input
            className="login-input"
            value={val}
            placeholder={t('Enter email')}
            onChange={(e) => {
              onChange?.(e.target.value);
            }}
          />
          {error && <span className="error-text">{error}</span>}
        </div>
      </div>
    );
  },
);

export default EmailInput;
