import { Button } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import CommonModal from 'components/CommonModal';
// import { resetWallet } from '@portkey/store/store-ca/wallet/actions';
// import { useAppDispatch } from 'store/Provider/hooks';
import './index.less';

interface ExitWalletProps {
  open: boolean;
  onCancel: () => void;
}

export default function ExitWallet({ open, onCancel }: ExitWalletProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const onConfirm = useCallback(async () => {
    // TODO: social recovery exist cur account
    // dispatch(resetWallet());
    //  recovery
    navigate('/');
  }, []);

  return (
    <CommonModal
      className="exist-wallet"
      closable={false}
      width={320}
      open={open}
      title={t('Are you sure you want to exit your wallet?')}
      footer={
        <div className="">
          <Button type="primary" onClick={onConfirm}>
            {t('I Understand，Confirm Exit')}
          </Button>
          <Button type="default" className="exist-wallet-btn-cancel" onClick={onCancel}>
            {t('Cancel')}
          </Button>
        </div>
      }>
      <div className="text-center modal-content">
        <div style={{ marginBottom: 12 }}>
          {t('Your current wallet and assets will be removed from this app permanently. This action cannot be undone.')}
        </div>
        <div>{t('You can ONLY recover this wallet with your guardians.')}</div>
      </div>
    </CommonModal>
  );
}
