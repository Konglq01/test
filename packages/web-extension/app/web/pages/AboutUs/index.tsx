import { useNavigate } from 'react-router';
import './index.less';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import MenuItem from 'components/MenuItem';
import BaseDrawer from 'pages/components/BaseDrawer';
import TermsOfService from '../TermsOfService';
import { useState } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import { useTranslation } from 'react-i18next';

function AboutUs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [termsShow, setTermsShow] = useState(false);
  const { isPrompt } = useCommonState();

  return (
    <div className={isPrompt ? 'about-us-prompt' : 'about-us'}>
      {isPrompt ? (
        <div className="about-us-prompt-header">{t('About Us')}</div>
      ) : (
        <SettingHeader
          title={t('About Us')}
          leftCallBack={() => navigate(-1)}
          rightElement={
            <CustomSvg
              type="Close2"
              style={{ width: 18, height: 18, cursor: 'pointer' }}
              onClick={() => navigate(-1)}
            />
          }
        />
      )}

      <div className="app-info">
        <CustomSvg type="PortKey" style={{ width: 80, height: 80 }} />
        <span className="version">{process.env.SDK_VERSION?.toUpperCase()}</span>
      </div>
      <div className="info-list">
        <MenuItem
          onClick={() => {
            isPrompt ? navigate('/terms-of-service') : setTermsShow(true);
          }}>
          {t('Terms of Service')}
        </MenuItem>
      </div>

      {!isPrompt && (
        <BaseDrawer className="terms-of-service-drawer" open={termsShow} placement="right">
          <TermsOfService
            onBack={() => {
              setTermsShow(false);
            }}
          />
        </BaseDrawer>
      )}
    </div>
  );
}

export default AboutUs;
