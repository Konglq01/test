import { Button } from 'antd';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import svgsList from 'assets/svgs';
import MenuItem from 'components/MenuItem';
import CustomSvg from 'components/CustomSvg';
import BackHeader from 'components/BackHeader';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useLockWallet } from 'utils/lib/serviceWorkerAction';
import './index.less';

interface MenuItemInfo {
  label: string;
  icon: keyof typeof svgsList;
  router: string;
}

export default function My() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lockWallet = useLockWallet();

  const MenuList: MenuItemInfo[] = useMemo(
    () => [
      {
        label: 'Wallet',
        icon: 'Wallet',
        router: '/setting/wallet',
      },
      {
        label: 'Contacts',
        icon: 'AddressBook2',
        router: '/setting/contacts',
      },
      {
        label: 'Account Setting',
        icon: 'Setting',
        router: '/setting/account-setting',
      },
      {
        label: 'Guardians',
        icon: 'Guardian',
        router: '/setting/guardians',
      },
    ],
    [],
  );

  const handleLock = useCallback(() => {
    lockWallet();
    navigate('/unlock');
  }, []);

  return (
    <div className="flex-column my-frame">
      <PortKeyHeader
        onUserClick={() => {
          navigate('/');
        }}
      />
      <BackHeader
        title={t('My')}
        leftCallBack={() => {
          navigate('/');
        }}
        rightElement={<Button onClick={handleLock}>{t('Lock')}</Button>}
      />
      <div className="menu-list">
        {MenuList.map((item) => (
          <MenuItem
            key={item.label}
            height={53}
            icon={<CustomSvg type={item.icon || 'Aelf'} style={{ width: 20, height: 20 }} />}
            onClick={() => {
              navigate(item.router);
            }}>
            {t(item.label)}
          </MenuItem>
        ))}
      </div>
    </div>
  );
}
