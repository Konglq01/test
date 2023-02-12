import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useTranslation } from 'react-i18next';
import { useCurrentWalletInfo, useDeviceList } from '@portkey/hooks/hooks-ca/wallet';
import svgsList from 'assets/svgs';
import './index.less';

export type CustomSvgName = keyof typeof svgsList;

export default function Device() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const deviceList = useDeviceList();
  const walletInfo = useCurrentWalletInfo();

  const mockData = [
    {
      managerAddress: 'managerAddress',
      deviceTypeInfo: {
        icon: 'deskMac',
        name: 'macOS',
      },
      loginTime: 'Jul 6 at 5:20pm',
    },
    {
      managerAddress: 'managerAddress',
      deviceTypeInfo: {
        icon: 'deskWin',
        name: 'Windows',
      },
      loginTime: 'Jul 6 at 5:20pm',
    },
    {
      managerAddress: 'managerAddress',
      deviceTypeInfo: {
        icon: 'phoneIOS',
        name: 'iPhone',
      },
      loginTime: 'Jul 6 at 5:20pm',
    },
    {
      managerAddress: 'managerAddress',
      deviceTypeInfo: {
        icon: 'phoneAndroid',
        name: 'Android',
      },
      loginTime: 'Jul 6 at 5:20pm',
    },
  ];

  console.log('---deviceList', deviceList);

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
      {(deviceList || mockData).map((item, index) => (
        <div key={index} className="device-content">
          <div className="content-item">
            <div className="item-desc">
              <div className="flex-center icon">
                <CustomSvg type={item.deviceTypeInfo.icon as CustomSvgName} />
              </div>
              <div className="name">{item.deviceTypeInfo.name}</div>
              {walletInfo.address === item.managerAddress && <div className="flex-center tag">{t('Current')}</div>}
            </div>
            <div className="item-time">
              <div className="time">{item.loginTime}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
