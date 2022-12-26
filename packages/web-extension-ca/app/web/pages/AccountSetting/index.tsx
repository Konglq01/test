import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import MenuItem from 'components/MenuItem';
import SetPin from './components/SetPin';
import './index.less';

interface MenuItemInfo {
  label: string;
  click: () => void;
}

export default function AccountSetting() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pinOpen, setPinOpen] = useState<boolean>(false);

  const MenuList: MenuItemInfo[] = useMemo(
    () => [
      {
        label: t('Change Pin'),
        click: () => {
          setPinOpen(true);
        },
      },
    ],
    [t],
  );

  return (
    <div className="account-setting-frame">
      <div className="account-setting-title">
        <BackHeader
          title={t('Account Setting')}
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
      <SetPin
        open={pinOpen}
        close={() => {
          setPinOpen(false);
        }}
      />
    </div>
  );
}
