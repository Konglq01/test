import { Input } from 'antd';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import clsx from 'clsx';
import './index.less';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import { NetworkItem } from '@portkey/types/types-ca/network';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { ChainItemType } from '@portkey/store/store-ca/wallet/type';
import { checkEmail, EmailError } from '@portkey/utils/check';
import { contractErrorHandler } from 'utils/tryErrorHandler';
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
        const checkError = checkEmail(email);
        if (checkError) throw i18n.t(checkError);
        if (!currentChain) throw 'Could not find chain information';
        let isHasAccount = false;
        try {
          const checkResult = await getHolderInfo({
            rpcUrl: currentChain.endPoint,
            address: currentChain.caContractAddress,
            chainType: currentNetwork.walletType,
            paramsOption: {
              loginGuardianAccount: email as string,
            },
          });
          console.log(checkResult, 'checkResult===GetHolderInfo');
          if (checkResult.result.guardiansInfo?.guardianAccounts?.length > 0) {
            isHasAccount = true;
          }
        } catch (error: any) {
          console.log(error, 'validateEmail===');
          if (error?.Error?.Details && error?.Error?.Details?.indexOf('Not found')) {
            isHasAccount = false;
          } else if (error?.Error?.Message === 'Invalid signature') {
            isHasAccount = false;
          } else {
            throw contractErrorHandler(error);
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
