import { Input } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import './index.less';

export default function BasicImportAccount({
  val,
  isValidKey,
  onClose,
  onChange,
}: {
  val: string;
  isValidKey?: boolean;
  onClose?: (e: any) => void;
  onChange?: (v: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="basic-import">
      <div className="account-body-header">
        <span onClick={onClose}>
          <CustomSvg type="Close2" style={{ width: 18, height: 18 }} />
        </span>
      </div>
      <div className="account-body-content">
        <div className="account-content-title">{t('Import Account')}</div>
        <div className="account-content-description">
          {t('Imported accounts are not related to your original Portkey account or its Secret Recovery Phrase')}
        </div>
        <div className="account-content-main">
          <p className="import-account-tip">{t('Enter Your Private Key String')}</p>
          <Input.TextArea
            value={val}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={t('Enter Your Private Key String Here')}
          />
          {!isValidKey && <div className="invalid-tip">{t('Invalid Private Key')}</div>}
        </div>
      </div>
    </div>
  );
}
