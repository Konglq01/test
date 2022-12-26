import { Button, Card } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import PortKeyTitle from '../components/PortKeyTitle';
import './index.less';

export default function RegisterWallet() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    getLocalStorage('registerStatus').then((registerStatus) => {
      if (registerStatus === 'Registered') {
        navigate('/');
      } else if (registerStatus === 'registrationNotBackedUp') {
        console.log('already register , no backup');
        navigate('/register/backup');
      } else {
        console.log('Not Registered');
      }
    });
  }, [navigate]);

  return (
    <div className="common-page register-prompt-wrapper">
      <PortKeyTitle />
      <>
        <div className="register-prompt-content">
          <h1 className="welcome-title">{t('Welcome to Portkey')}</h1>
          <div className="flex card-wrapper">
            <div className="card-box">
              <div className="description-area">
                <CustomSvg type="Import" className="cover-icon" />
                <p className="description">{t('Import your existing wallet using a Secret Recovery Phrase')}</p>
              </div>
              <Button
                type="primary"
                className="action-button"
                onClick={() => {
                  navigate('/register/load');
                }}>
                {t('Access Existing Wallet')}
              </Button>
            </div>
            <div className="card-box">
              <div className="description-area">
                <CustomSvg type="Plus2" className="cover-icon" />
                <p className="description">{t('Start here, explore Web3 world')}</p>
              </div>
              <Button
                type="primary"
                className="action-button"
                onClick={() => {
                  navigate('/register/create');
                }}>
                {t('Create a New Wallet')}
              </Button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
