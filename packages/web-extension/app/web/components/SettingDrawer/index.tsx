import { DrawerProps } from 'antd';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import PortKeyHeader, { PortKeyHeaderInstance } from '../../pages/components/PortKeyHeader';
import BaseDrawer from 'pages/components/BaseDrawer';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import svgsList from '../../assets/svgs';

import './index.less';
import SettingHeader from 'pages/components/SettingHeader';
import MenuItem from 'components/MenuItem';
import CustomSvg from 'components/CustomSvg';
import { useLockWallet } from 'utils/lib/serviceWorkerAction';

export interface SettingMenuItemInfo {
  label: string;
  key: string;
  icon?: keyof typeof svgsList;
}

const settingList: SettingMenuItemInfo[] = [
  { label: 'Contacts', key: 'address-book', icon: 'AddressBook2' },
  { label: 'Security & Privacy', key: 'security-privacy', icon: 'Lock' },
  { label: 'General', key: 'global-setting', icon: 'Setting' },
  { label: 'Manage Networks', key: 'manage-networks', icon: 'Network' },
  { label: 'About Us', key: 'about-us', icon: 'Warning' },
];

export default function SettingDrawer({
  onMenuClick,
  ...props
}: { onMenuClick?: (key: string) => void } & DrawerProps) {
  const { t } = useTranslation();
  const portKeyHeaderRef = useRef<PortKeyHeaderInstance>();

  const menuClick = useCallback(
    (info: SettingMenuItemInfo) => {
      if (info.key === 'manage-networks') {
        portKeyHeaderRef.current?.showManageNetwork();
        return;
      }
      onMenuClick?.(info.key);
    },
    [onMenuClick],
  );

  const lockWallet = useLockWallet();

  return (
    <BaseDrawer
      className="setting-drawer"
      {...props}
      title={<PortKeyHeader ref={portKeyHeaderRef} onUserClick={(e) => props?.onClose?.(e)} />}
      placement="left">
      <div className="setting-body">
        <SettingHeader
          title={t('Settings')}
          leftCallBack={(e) => props?.onClose?.(e)}
          rightElement={
            <div className="lock-btn" style={{ cursor: 'pointer' }} onClick={lockWallet}>
              {t('Lock')}
            </div>
          }
        />
        <div className="menu-list">
          {settingList.map((item) => (
            <MenuItem
              key={item.key}
              height={53}
              icon={<CustomSvg type={item.icon || 'Aelf'} style={{ width: 20, height: 20 }} />}
              onClick={() => menuClick(item)}>
              {t(item.label)}
            </MenuItem>
          ))}
        </div>
        <div
          className="expand-btn"
          onClick={() => {
            InternalMessage.payload(PortkeyMessageTypes.EXPAND_FULL_SCREEN).send();
          }}>
          <CustomSvg type="Expand" style={{ width: 16, height: 16 }} />
          <span>{t('Expand View')}</span>
        </div>
      </div>
    </BaseDrawer>
  );
}
