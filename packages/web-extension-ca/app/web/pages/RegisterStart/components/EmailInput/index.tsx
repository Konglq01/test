import { EmailReg } from '@portkey/utils/reg';
import { Input } from 'antd';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import clsx from 'clsx';
import './index.less';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import { NetworkItem } from '@portkey/constants/constants-ca/network';
import { searchLoginGuardianType } from '@portkey/graphql/contract/queries';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';

enum EmailError {
  noEmail = 'Please enter Email address',
  invalidEmail = 'Invalid email address',
  alreadyRegistered = 'This address is already registered',
  noAccount = 'Failed to log in with this email. Please use your login account.',
}

interface EmailInputProps {
  currentNetwork: NetworkItem;
  wrapperClassName?: string;
  error?: string;
  val?: string;
  onChange?: (val: string) => void;
}

export interface EmailInputInstance {
  validateEmail: (email?: string, type?: 'login' | 'registered') => Promise<void>;
}

const EmailInput = forwardRef(({ error, val, wrapperClassName, currentNetwork, onChange }: EmailInputProps, ref) => {
  const { t } = useTranslation();

  const validateEmail = useCallback(
    async (email?: string, type?: 'login' | 'registered') => {
      if (!email) throw i18n.t(EmailError.noEmail);
      if (!EmailReg.test(email)) throw i18n.t(EmailError.invalidEmail);
      // const checkResult = await searchLoginGuardianType(currentNetwork.networkType, {
      //   chainId: 'AELF',
      //   loginGuardianType: email,
      // });
      // const loginGuardianTypeInfo = checkResult.data.loginGuardianTypeInfo;
      // console.log(loginGuardianTypeInfo, !loginGuardianTypeInfo.length, 'loginGuardianTypeInfo===');
      // if (type === 'registered') {
      //   if (loginGuardianTypeInfo.length) throw i18n.t(EmailError.alreadyRegistered);
      // } else {
      //   if (!loginGuardianTypeInfo.length) throw i18n.t(EmailError.noAccount);
      // }
      //     const checkResult = await getHolderInfo({
      //       // rpcUrl: currentNetwork.
      // address: currentNetwork.
      // chainType: ChainType;
      // paramsOption: {
      //   loginGuardianType: string;
      // };
      //     });
    },
    [currentNetwork],
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
});

export default EmailInput;
