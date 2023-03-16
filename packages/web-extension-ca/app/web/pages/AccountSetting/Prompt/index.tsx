import MenuList from 'pages/components/MenuList';
import { IAccountSettingProps } from '../index';
import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { Outlet } from 'react-router';

export default function AccountSettingPrompt({ headerTitle, menuList }: IAccountSettingProps) {
  return (
    <div className="account-setting-prompt">
      <SecondPageHeader title={headerTitle} />
      <div className="account-setting-body">
        <MenuList list={menuList} height={64} />
        {/* <div className="next-page"> */}
        <Outlet />
        {/* </div> */}
      </div>
    </div>
  );
}
