import { useNavigate } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import { useTranslation } from 'react-i18next';
import AutoLock from './components/AutoLock';
import LanguageMenu from './components/LanguageMenu';
import CustomSvg from 'components/CustomSvg';

import './index.less';
import { useCommonState } from 'store/Provider/hooks';

export default function GlobalSetting() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isPrompt } = useCommonState();

  return (
    <div className="global-setting">
      {isPrompt ? (
        <div className="setting-prompt-header">{t('General')}</div>
      ) : (
        <SettingHeader
          title={t('General')}
          leftCallBack={() => navigate(-1)}
          rightElement={<CustomSvg type="Close2" style={{ width: 18, height: 18 }} onClick={() => navigate(-1)} />}
        />
      )}

      <div className="content">
        <div className="setting-title">{t('Current Language')}</div>
        <LanguageMenu />

        <div className="setting-title">{t('Auto-Lock')}</div>
        <AutoLock />
      </div>
    </div>
  );
}
