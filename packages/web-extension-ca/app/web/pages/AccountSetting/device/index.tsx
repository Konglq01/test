import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useTranslation } from 'react-i18next';

import './index.less';

export default function Device() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const data = [
    {
      name: 'macOS',
      icon: 'deskMac',
      time: 'Jul 6 at 5:20pm',
      isCurrent: false,
    },
    {
      name: 'Windows',
      icon: 'deskWin',
      time: 'Jul 6 at 5:20pm',
      isCurrent: true,
    },
    {
      name: 'iPhone',
      icon: 'phoneIOS',
      time: 'Jul 6 at 5:20pm',
      isCurrent: false,
    },
    {
      name: 'Android',
      icon: 'phoneAndroid',
      time: 'Jul 6 at 5:20pm',
      isCurrent: false,
    },
  ];

  return (
    <div className="device-frame">
      <div className="device-title">
        <SettingHeader
          title={t('Devices')}
          leftCallBack={() => {
            navigate('/setting/account-setting');
          }}
          rightElement={
            <CustomSvg
              type="Close2"
              onClick={() => {
                navigate('/setting/account-setting');
              }}
            />
          }
        />
      </div>
      {data.map((item, index) => (
        <div key={index} className="device-content">
          <div className="content-item">
            <div className="item-desc">
              <div className="icon">
                {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
                <CustomSvg type={item.icon as any} style={{ width: 16, height: 16 }} />
              </div>
              <div className="name">{item.name}</div>
              {item.isCurrent && <div className="tag">{t('Current')}</div>}
            </div>
            <div className="item-time">
              <div className="time">{item.time}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
