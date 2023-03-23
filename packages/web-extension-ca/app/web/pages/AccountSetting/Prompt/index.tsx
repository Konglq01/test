import MenuList from 'pages/components/MenuList';
import { IAccountSettingProps } from '../index';
import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { Outlet } from 'react-router';

export default function AccountSettingPrompt({ headerTitle, menuList }: IAccountSettingProps) {
  return (
    <div className="account-setting-prompt">
      <div className="account-setting-body">
        <SecondPageHeader className="account-setting-header" title={headerTitle} leftElement={false} />

        <MenuList list={menuList} height={64} />
      </div>
      <Outlet />
    </div>
  );
}
