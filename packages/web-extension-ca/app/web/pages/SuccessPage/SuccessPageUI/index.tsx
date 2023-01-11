import CustomSvg from 'components/CustomSvg';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import { useTranslation } from 'react-i18next';
import { SuccessPageType } from 'types/UI';
import './index.less';

export default function SuccessPageUI({ type }: { type?: SuccessPageType; onConfirm?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="success-page-wrapper">
      <div className="common-page success-page-content-wrapper">
        <PortKeyTitle />
        <div className="success-page-content">
          <CustomSvg type="Congratulations" className="congratulations-icon" />
          {type === SuccessPageType.Created && <h1>{t('Sign up success !')}</h1>}
          {type === SuccessPageType.Login && <h1>{t('Successfully logged in')}</h1>}
        </div>
      </div>
      <div className="flex created-tip-wrapper">
        <CustomSvg type="PortKey" />
        <div className="created-tip-content">
          <h3>{t('Wallet created!')}</h3>
          <div>
            {t('Pin the Portkey Extension')} <br /> {t('Click')} <CustomSvg type="extension" /> {t('and then')}{' '}
            <CustomSvg type="fixed" /> {t('for easy wallet access')}
          </div>
        </div>
      </div>
    </div>
  );
}
