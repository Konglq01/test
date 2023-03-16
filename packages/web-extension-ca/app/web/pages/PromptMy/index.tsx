import CustomSvg from 'components/CustomSvg';
import MenuItem from 'components/MenuItem';
import { useLocation, useNavigate } from 'react-router';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import svgsList from 'assets/svgs';
import { useLockWallet } from 'utils/lib/serviceWorkerAction';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import SettingHeader from 'pages/components/SettingHeader';
import './index.less';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';

interface MyMenuItemInfo {
  label: string;
  key: string;
  icon: keyof typeof svgsList;
  pathname: string;
}

export default function PromptMy() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const settingList: MyMenuItemInfo[] = useMemo(
    () => [
      { label: 'Wallet', key: '/setting/wallet', pathname: '/setting/wallet', icon: 'Wallet' },
      {
        label: 'Contacts',
        key: '/setting/contacts',
        pathname: '/setting/contacts',
        icon: 'AddressBook2',
      },
      {
        label: 'Account Setting',
        key: '/setting/account-setting',
        pathname: '/setting/account-setting',
        icon: 'Setting',
      },
      { label: 'Guardians', key: '/setting/guardians', pathname: '/setting/guardians', icon: 'Guardians' },
      {
        label: 'WalletSecurity',
        key: '/setting/wallet-security',
        pathname: '/setting/wallet-security',
        icon: 'Guardians',
      },
    ],
    [],
  );

  const curMenuInfo = useMemo(() => settingList.find((item) => item.key === pathname) || null, [pathname, settingList]);

  useEffect(() => {
    if (!curMenuInfo)
      navigate(`/setting/wallet`, {
        replace: true,
      });
  }, [curMenuInfo, navigate]);

  const lockWallet = useLockWallet();
  const handleLock = useCallback(() => {
    lockWallet();
    navigate('/unlock');
  }, [lockWallet, navigate]);

  const backCb = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="prompt-my-page flex-column">
      <PortKeyHeader onUserClick={backCb} />

      <div className="prompt-my-frame">
        <SettingHeader title={t('My')} leftCallBack={backCb} />
        <div className="prompt-my-body">
          <div className="prompt-my-menu-list">
            {settingList.map((item) => (
              <MenuItem
                className={clsx(['menu-item-common', item.key === curMenuInfo?.key ? 'menu-item-selected' : undefined])}
                key={item.key}
                height={56}
                icon={<CustomSvg type={item.icon || 'Aelf'} />}
                onClick={() =>
                  navigate(item.pathname, {
                    replace: true,
                  })
                }
                showEnterIcon={false}>
                {t(item.label)}
              </MenuItem>
            ))}
            <div className="lock-row flex-center" onClick={handleLock}>
              {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
              <CustomSvg type={'Lock'} style={{ width: 16, height: 16 }} />
              <span className="lock-text">{t('Lock')}</span>
            </div>
          </div>
          <div className="prompt-my-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
