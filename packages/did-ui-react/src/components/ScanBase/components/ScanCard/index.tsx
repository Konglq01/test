import QRCode from 'qrcode.react';
import './index.less';

interface ScanCardProps {
  isShowIcon?: boolean;
  qrData?: string; // JSON.stringify(LoginQRData)
  backIcon?: React.ReactNode;
  onBack?: () => void;
}

export default function ScanCard({ qrData, backIcon, isShowIcon = true, onBack }: ScanCardProps) {
  return (
    <div className="scan-card-wrapper">
      <h2 className="scan-title">
        Scan code to log in
        {isShowIcon && backIcon && (
          <div className="back-icon-wrapper" onClick={onBack}>
            {backIcon}
          </div>
        )}
      </h2>
      <p>Please use the portkey Dapp to scan the QR code</p>
      <div className="scan-content">
        {qrData && <QRCode className="qrc" value={qrData} style={{ width: 170, height: 170 }} />}
      </div>
    </div>
  );
}
