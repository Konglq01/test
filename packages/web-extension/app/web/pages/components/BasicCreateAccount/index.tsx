import { Input } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import './index.less';

export default function BasicCreateAccount({
  val,
  onClose,
  onChange,
}: {
  val: string;
  onClose: () => void;
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="basic-create-account">
      <div className="account-body-header">
        <span onClick={() => onClose()}>
          <CustomSvg type="Close2" style={{ width: 18, height: 18 }} />
        </span>
      </div>
      <div className="account-body-content">
        <div className="account-content-title">{t('Create Account')}</div>
        <div className="account-content-main">
          <p className="create-account-tip">{t('Account Name')}</p>
          <Input
            value={val}
            onChange={(e) => onChange(e.target.value)}
            maxLength={30}
            placeholder={t('Enter a Name')}
          />
        </div>
      </div>
    </div>
  );
}
