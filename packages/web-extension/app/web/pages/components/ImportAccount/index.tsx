import { Button, DrawerProps } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseDrawer from '../BaseDrawer';
import BasicImportAccount from '../BasicImportAccount';

interface ImportAccountProps extends DrawerProps {
  onConfirm?: (v: string) => void;
  isValidKey?: boolean;
}

export default function ImportAccount({ onConfirm, isValidKey, ...props }: ImportAccountProps) {
  const { t } = useTranslation();
  const [val, setVal] = useState<string>('');

  useEffect(() => {
    if (!props.open) {
      setVal('');
    }
  }, [props.open]);

  return (
    <BaseDrawer
      className="import-account"
      {...props}
      destroyOnClose
      placement="right"
      footer={
        <div className="import-account-footer">
          <Button type="primary" disabled={!val} onClick={() => onConfirm?.(val)}>
            {t('Import')}
          </Button>
        </div>
      }>
      <BasicImportAccount val={val} onChange={(v) => setVal(v)} isValidKey={isValidKey} onClose={props?.onClose} />
    </BaseDrawer>
  );
}
