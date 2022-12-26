import { Button, DrawerProps } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseDrawer from '../BaseDrawer';
import BasicCreateAccount from '../BasicCreateAccount';
import './index.less';

interface CreateAccountProps extends DrawerProps {
  onCreate?: (v?: string) => void;
  onClose: () => void;
}

export default function CreateAccount({ onCreate, onClose, ...props }: CreateAccountProps) {
  const { t } = useTranslation();
  const [val, setVal] = useState<string>('');

  useEffect(() => {
    if (!props.open) {
      setVal('');
    }
  }, [props.open]);

  return (
    <BaseDrawer
      className="create-account"
      {...props}
      destroyOnClose
      placement="right"
      footer={
        <div className="create-account-footer">
          <Button type="primary" disabled={!val} onClick={() => onCreate?.(val)}>
            {t('Create')}
          </Button>
        </div>
      }>
      <BasicCreateAccount val={val} onClose={onClose} onChange={setVal} />
    </BaseDrawer>
  );
}
