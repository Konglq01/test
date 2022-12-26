import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { SuccessPageType } from 'types/UI';
import PortKeyTitle from '../PortKeyTitle';
import './index.less';

export default function SuccessPageUI({ type, onConfirm }: { type?: SuccessPageType; onConfirm?: () => void }) {
  const { t } = useTranslation();

  // does not need
  // const rightElement = useMemo(() => {
  //   if (type === SuccessPageType.Creating) return 'Step 2/5';
  //   if (type === SuccessPageType.Created) return 'Step 5/5';
  //   if (type === SuccessPageType.Importing) return 'Step 2/4';
  //   if (type === SuccessPageType.Imported) return 'Step 4/4';
  //   return undefined;
  // }, [type]);

  return (
    <div className="success-page-wrapper">
      <div className="common-page success-page-content-wrapper">
        <PortKeyTitle />
        <div className="success-page-content">
          <CustomSvg type="Congratulations" className="congratulations-icon" />
          <h1>{t('Congratulations!')}</h1>
          {type === SuccessPageType.Creating && (
            <>
              <p>{t('The wallet has been created successfully')}</p>
              <div className="tip-content">
                {t(
                  'Before getting started, you need to view and back up your Secret Recovery Phrase. This can help you protect your wallet',
                )}
              </div>
            </>
          )}
          {type === SuccessPageType.Created && <p>{t('The Secret Recovery Phrase confirmed successfully')}</p>}
          {type === SuccessPageType.Importing && (
            <>
              <p>{t('Importing:The Secret Recovery Phrase confirmed successfully')}</p>
              <div className="tip-content">
                {t(
                  'Please create a wallet name and password. The password is used to unlock your wallet only on this device',
                )}
              </div>
            </>
          )}
          {type === SuccessPageType.Imported && <p>{t('The wallet has been imported successfully!')}</p>}
          <Button className="confirm-btn" type="primary" onClick={onConfirm}>
            {type === SuccessPageType.Creating && t('View Secret Recovery Phrase')}
            {(type === SuccessPageType.Created || type === SuccessPageType.Imported) && t('Enter Wallet')}
            {type === SuccessPageType.Importing && t('Create Wallet')}
          </Button>
        </div>
      </div>
      {type !== SuccessPageType.Creating && type !== SuccessPageType.Importing && (
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
      )}
    </div>
  );
}
