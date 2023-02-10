/* eslint-disable no-inline-styles/no-inline-styles */
import CustomSvg from 'components/CustomSvg';
import './index.less';
import { useTranslation } from 'react-i18next';

export interface BalanceCardProps {
  accountInfo?: any;
  amount?: string | number;
  onSend?: () => void;
  onReceive?: () => void;
}

export default function BalanceCard({ onSend, onReceive }: BalanceCardProps) {
  const { t } = useTranslation();

  return (
    <div className="balance-card">
      <div className="balance-btn">
        <span className="send btn" onClick={onSend}>
          <CustomSvg type="RightTop" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Send')}</span>
        </span>
        <span className="receive btn" onClick={onReceive}>
          <CustomSvg type="RightDown" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Receive')}</span>
        </span>
      </div>
    </div>
  );
}
