import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { Tabs, TabsProps } from 'antd';
import { useCallback, useMemo } from 'react';
import { RegisterType } from 'types/wallet';
import EmailTab from '../EmailTab';
import PhoneTab from '../PhoneTab';
import './index.less';

export default function InputInfo({
  type,
  onFinish,
}: {
  type: RegisterType;
  onFinish: (v: { loginType: LoginType; value: string }) => void;
}) {
  const onChange = useCallback((activeKey: string) => {
    //
    console.log(activeKey, 'activeKey===');
  }, []);
  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: LoginType[LoginType.PhoneNumber],
        label: 'Phone',
        children: (
          <PhoneTab
            onFinish={(v) => {
              onFinish({
                loginType: LoginType.Apple,
                value: `${v.code} ${v.phoneNumber}`,
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
            type={type}
            onFinish={(v) => {
              onFinish({
                loginType: LoginType.Email,
                value: v,
              });
            }}
          />
        ),
      },
    ],
    [onFinish, type],
  );

  return (
    <div className="input-info-wrapper">
      <Tabs defaultActiveKey={LoginType[LoginType.PhoneNumber]} items={items} onChange={onChange} />
    </div>
  );
}
