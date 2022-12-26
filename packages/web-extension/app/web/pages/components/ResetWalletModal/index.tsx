import { resetWallet } from '@portkey/store/wallet/actions';
import { Button, Col, Row } from 'antd';
import CommonModal, { CommonModalProps } from 'components/CommonModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { clearLocalStorage } from 'utils/storage/chromeStorage';
import './index.less';

export default function ResetWalletModal({ open, onCancel }: CommonModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onConfirm = useCallback(async () => {
    dispatch(resetWallet());
    await clearLocalStorage();
    navigate('/register');
  }, [dispatch, navigate]);
  return (
    <CommonModal
      className="reset-modal"
      closable={false}
      width={320}
      open={open}
      title={t('Have You Written Down Your Secret Recovery Phrase?')}>
      <div className="text-center reset-modal-content">
        {t(
          'This session will be closed after you click "Yes" and you will not be able to access the current wallet without your Secret Recovery Phrase',
        )}
      </div>
      <div className="reset-modal-footer">
        <Button onClick={onCancel}>{t('No')}</Button>
        <Button type="primary" onClick={onConfirm}>
          {t('Yes')}
        </Button>
      </div>
    </CommonModal>
  );
}
