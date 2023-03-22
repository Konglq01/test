import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { Tabs, TabsProps } from 'antd';
import { useMemo } from 'react';
import { ValidateHandler } from 'types/wallet';
import EmailTab from '../EmailTab';
import PhoneTab from '../PhoneTab';
import './index.less';

export interface InputInfoProps {
  confirmText: string;
  validateEmail?: ValidateHandler;
  onFinish: (v: { loginType: LoginType; guardianAccount: string }) => void;
}

export default function InputInfo({ confirmText, validateEmail, onFinish }: InputInfoProps) {
  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: LoginType[LoginType.Phone],
        label: 'Phone',
        children: (
          <PhoneTab
            confirmText={confirmText}
            onFinish={(v) => {
              onFinish({
                loginType: LoginType.Phone,
                guardianAccount: `${v.code}-${v.phoneNumber}`,
              });
            }}
          />
        ),
      },
      {
        key: LoginType[LoginType.Email],
        label: 'Email',
        children: (
          <EmailTab
            confirmText={confirmText}
            validateEmail={validateEmail}
            onFinish={(v) => {
              onFinish({
                loginType: LoginType.Email,
                guardianAccount: v,
              });
            }}
          />
        ),
      },
    ],
    [onFinish, confirmText, validateEmail],
  );

  return (
    <div className="input-info-wrapper">
      <Tabs defaultActiveKey={LoginType[LoginType.Phone]} items={items} />
    </div>
  );
}
