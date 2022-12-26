import { Button } from 'antd';
import type { DrawerProps } from 'antd';
import { useMemo } from 'react';
import './index.less';
import BaseDrawer from '../BaseDrawer';
import CommonModal from 'components/CommonModal';
import { useTranslation } from 'react-i18next';

interface ImportAccountResultProps extends DrawerProps {
  onSetAccount?: () => void;
  isImportSuccess: boolean;
}

const staticResultInfo = {
  success: {
    title: 'Account Successfully Imported!',
    content: 'You are now able to view your account in Portkey',
  },
  fail: {
    title: 'Account Import Failed!',
    content: 'The account is already displayed in the account list',
  },
};

export default function ImportAccountResult({
  onSetAccount,
  isImportSuccess,
  onClose,
  ...props
}: ImportAccountResultProps) {
  const { t } = useTranslation();
  const resultInfo = useMemo(() => staticResultInfo[isImportSuccess ? 'success' : 'fail'], [isImportSuccess]);

  return (
    <CommonModal
      className="result-page"
      {...props}
      width="320px"
      destroyOnClose
      closable={false}
      title={t(resultInfo.title)}>
      <p className="result-content">{t(resultInfo.content)}</p>
      <div className="action">
        {isImportSuccess ? (
          <div className="success-result">
            <Button onClick={onClose} className="btn" type="primary">
              {t('Close')}
            </Button>
          </div>
        ) : (
          <div className="result-btn">
            <Button className="btn" onClick={onClose}>
              {t('Reimport')}
            </Button>
            <Button className="btn" type="primary" onClick={() => onSetAccount?.()}>
              {t('View This Account')}
            </Button>
          </div>
        )}
      </div>
    </CommonModal>
  );
}
