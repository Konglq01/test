import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import MenuItem from 'components/MenuItem';
import './index.less';
import { message } from 'antd';

interface MenuItemInfo {
  label: string;
  click: () => void;
}

export default function AccountSetting() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const MenuList: MenuItemInfo[] = useMemo(
    () => [
      {
        label: t('Change Pin'),
        click: () => {
          message.info('Coming soon. Check back here for updates', 1);
          // setPinOpen(true);
        },
      },
    ],
    [navigate, t],
  );

  return (
    <div className="account-setting-frame">
      <div className="account-setting-title">
        <BackHeader
          title={t('Account Setting')}
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
          <MenuItem key={item.label} height={53} onClick={item.click}>
            {t(item.label)}
          </MenuItem>
        ))}
      </div>
    </div>
  );
}
