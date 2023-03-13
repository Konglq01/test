import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/wallet';
import { useCallback, useState } from 'react';

interface DeviceDetailProps {
  curDevice?: DeviceItemType;
  setCurName: (v: string) => void;
}

export default function DeviceDetail(props: DeviceDetailProps) {
  const { t } = useTranslation();
  const { curDevice, setCurName } = props;
  const [name, setName] = useState(curDevice?.deviceTypeInfo.name || '');

  const handleInput = useCallback(
    (value: string) => {
      setCurName(value);
      setName(value);
    },
    [setCurName],
  );

  return (
    <div className="change-name">
      <Input
        value={name}
        autoComplete="off"
        onChange={(e) => handleInput(e.target.value)}
        placeholder={t('Enter Device Name')}
        maxLength={16}
      />
    </div>
  );
}
