import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useTranslation } from 'react-i18next';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import svgsList from 'assets/svgs';
import { dateFormat } from 'utils';
import './index.less';

export type CustomSvgName = keyof typeof svgsList;

export default function Device() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const deviceList = useDeviceList();
  const walletInfo = useCurrentWalletInfo();

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
      {deviceList.map((item) => (
        <div key={item.managerAddress} className="device-content">
          <div className="content-item">
            <div className="item-desc">
              <div className="flex-center icon">
                <CustomSvg type={item.deviceTypeInfo.icon as CustomSvgName} />
              </div>
              <div className="name">{item.deviceTypeInfo.name}</div>
              {walletInfo.address === item.managerAddress && <div className="flex-center tag">{t('Current')}</div>}
            </div>
            <div className="item-time">
              {item.loginTime && <div className="time">{dateFormat(item.loginTime)}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
