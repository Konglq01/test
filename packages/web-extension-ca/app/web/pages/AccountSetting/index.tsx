import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCommonState } from 'store/Provider/hooks';
import AccountSettingPrompt from './Prompt';
import AccountSettingPopup from './Popup';
import { MenuItemInfo } from 'pages/components/MenuList';

export interface IAccountSettingProps {
  headerTitle: string;
  menuList: MenuItemInfo[];
}

export default function AccountSetting() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isPrompt } = useCommonState();

  const MenuList: MenuItemInfo[] = useMemo(
    () => [
      {
        label: 'Change Pin',
        key: 1,
        click: () => {
          navigate('/setting/account-setting/set-pin');
        },
      },
    ],
    [navigate],
  );

  const headerTitle = t('Account Setting');

  return isPrompt ? (
    <AccountSettingPrompt headerTitle={headerTitle} menuList={MenuList} />
  ) : (
    <AccountSettingPopup headerTitle={headerTitle} menuList={MenuList} />
  );
}
