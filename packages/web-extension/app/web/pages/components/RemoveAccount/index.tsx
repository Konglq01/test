import { AccountType } from '@portkey-wallet/types/wallet';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.less';

interface RemoveAccountProps {
  onBack?: () => void;
  onRemove?: () => void;
  accountInfo: AccountType;
}
export default function RemoveAccount({ accountInfo, onBack, onRemove }: RemoveAccountProps) {
  const { t } = useTranslation();
  return (
    <div className="remove-account-wrapper">
      <div className="remove-account-content">
        <div className="account-info">
          <div className="name">{accountInfo.accountName}</div>
          <p className="address">{accountInfo.address}</p>
        </div>
        <p className="remove-tip">
          {t(
            'This account will be removed from your wallet. Please make sure you have the original Secret Recovery Phrase or private key for this imported account before continuing',
          )}
        </p>
      </div>
      <div className="remove-actions">
        <Button type="default" onClick={onBack}>
          {t('Never Mind')}
        </Button>
        <Button type="primary" onClick={onRemove}>
          {t('Remove')}
        </Button>
      </div>
    </div>
  );
}
