import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import PortKeyHeader from '../components/PortKeyHeader';
import svgslist from '../../assets/svgs';

import './index.less';
import SettingHeader from 'pages/components/SettingHeader';
import MenuItem from 'components/MenuItem';
import CustomSvg from 'components/CustomSvg';
import AddressBook from 'pages/AddressBook';
import SecurityPrivacy from 'pages/SecurityPrivacy';
import GlobalSetting from 'pages/GlobalSetting';
import AboutUs from 'pages/AboutUs';
import { useNavigate, useParams } from 'react-router';
import { useLockWallet } from 'utils/lib/serviceWorkerAction';
import PromptNetworks from 'pages/components/PromptNetworks';

export interface SettingMenuItemInfo {
  label: string;
  key: string;
  icon?: keyof typeof svgslist;
  element?: ReactNode;
}

export default function PromptSetting() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { menuKey, subMenuKey } = useParams();

  const settingList: SettingMenuItemInfo[] = useMemo(
    () => [
      { label: 'Contacts', key: 'address-book', icon: 'AddressBook2', element: <AddressBook /> },
      {
        label: 'Security & Privacy',
        key: 'security-privacy',
        icon: 'Lock',
        element: <SecurityPrivacy curMenu={subMenuKey} />,
      },
      { label: 'General', key: 'global-setting', icon: 'Setting', element: <GlobalSetting /> },
      { label: 'Manage Networks', key: 'manage-networks', icon: 'Network', element: <PromptNetworks /> },
      { label: 'About Us', key: 'about-us', icon: 'Warning', element: <AboutUs /> },
    ],
    [subMenuKey],
  );

  const curMenuInfo = useMemo(() => settingList.find((item) => item.key === menuKey) || null, [menuKey, settingList]);

  useEffect(() => {
    if (!curMenuInfo)
      navigate(`/setting/address-book`, {
        replace: true,
      });
  }, [curMenuInfo, navigate]);

  const lockWallet = useLockWallet();

  const backCb = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="setting-page">
      <PortKeyHeader onUserClick={backCb} />

      <div className="setting-frame">
        <SettingHeader
          title={t('Settings')}
          leftCallBack={backCb}
          rightElement={
            <div className="lock-btn" onClick={lockWallet}>
              {t('Lock')}
            </div>
          }
        />
        <div className="setting-body">
          <div className="settings-menu-list">
            {settingList.map((item) => (
              <MenuItem
                className={item.key === curMenuInfo?.key ? 'menu-item-selected' : undefined}
                key={item.key}
                height={44}
                icon={<CustomSvg type={item.icon || 'Aelf'} style={{ width: 20, height: 20 }} />}
                onClick={() =>
                  navigate(`/setting/${item.key}`, {
                    replace: true,
                  })
                }
                showEnterIcon={false}>
                {t(item.label)}
              </MenuItem>
            ))}
          </div>
          <div className="setting-content">{curMenuInfo && curMenuInfo.element}</div>
        </div>
      </div>
    </div>
  );
}
