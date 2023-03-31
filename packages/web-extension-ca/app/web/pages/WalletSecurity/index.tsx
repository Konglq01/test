import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import MenuItem from 'components/MenuItem';
import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import './index.less';

export default function WalletSecurity() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deviceList } = useDeviceList();

  const MenuList = useMemo(
    () => [
      {
        key: t('Login Devices'),
        label: (
          <div className="flex manage-device">
            <span>{t('Login Devices')}</span>
            <span className="number">{deviceList.length}</span>
          </div>
        ),
        click: () => {
          navigate('/setting/wallet-security/manage-devices');
        },
      },
    ],
    [deviceList.length, navigate, t],
  );

  return (
    <div className="wallet-security-frame">
      <div className="wallet-security-title">
        <BackHeader
          title={t('Wallet Security')}
          leftCallBack={() => {
            navigate('/setting');
          }}
          rightElement={
            <CustomSvg
              type="Close2"
              onClick={() => {
                navigate('/setting');
              }}
            />
          }
        />
      </div>
      <div className="menu-list">
        {MenuList.map((item) => (
          <MenuItem key={item.key} height={53} onClick={item.click}>
            {item.label}
          </MenuItem>
        ))}
      </div>
    </div>
  );
}
