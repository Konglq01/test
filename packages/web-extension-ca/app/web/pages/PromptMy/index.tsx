import CustomSvg from 'components/CustomSvg';
import MenuItem from 'components/MenuItem';
import { useNavigate, useParams } from 'react-router';
import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import svgsList from 'assets/svgs';
import { useLockWallet } from 'utils/lib/serviceWorkerAction';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import SettingHeader from 'pages/components/SettingHeader';
import './index.less';
import Wallet from 'pages/Wallet';
import Guardians from 'pages/Guardians';
import Contacts from 'pages/Contacts';
import WalletSecurity from 'pages/WalletSecurity';
import clsx from 'clsx';

interface MyMenuItemInfo {
  label: string;
  key: string;
  icon: keyof typeof svgsList;
  router?: string;
  element?: ReactNode;
}

export default function PromptMy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { menuKey } = useParams();

  const settingList: MyMenuItemInfo[] = useMemo(
    () => [
      { label: 'Wallet', key: 'wallet', icon: 'Wallet', element: <Wallet /> },
      { label: 'Contacts', key: 'address-book', icon: 'AddressBook2', element: <Contacts /> },
      {
        label: 'Account Setting',
        key: 'account-setting',
        icon: 'Setting',
        element: <WalletSecurity />,
      },
      { label: 'Guardians', key: 'guardian', icon: 'Guardian', element: <Guardians /> },
    ],
    [],
  );

  const curMenuInfo = useMemo(() => settingList.find((item) => item.key === menuKey) || null, [menuKey, settingList]);

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
        <SettingHeader
          title={t('My')}
          leftCallBack={backCb}
          // rightElement={
          //   <div className="lock-btn" onClick={handleLock}>
          //     {t('Lock')}
          //   </div>
          // }
        />
        <div className="prompt-my-body">
          <div className="prompt-my-menu-list">
            {settingList.map((item) => (
              <MenuItem
                className={clsx(['menu-item-common', item.key === curMenuInfo?.key ? 'menu-item-selected' : undefined])}
                key={item.key}
                height={56}
                // eslint-disable-next-line no-inline-styles/no-inline-styles
                icon={<CustomSvg type={item.icon || 'Aelf'} />}
                onClick={() =>
                  navigate(`/setting/${item.key}`, {
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
          <div className="prompt-my-content">{curMenuInfo && curMenuInfo.element}</div>
        </div>
      </div>
    </div>
  );
}
