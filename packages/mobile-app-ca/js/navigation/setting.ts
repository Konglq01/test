import { IconName } from 'components/Svg';
import { RootStackName } from './index';

type SettingMenuItem = {
  name: RootStackName;
  label: string;
  index: number;
  icon: IconName;
};

export const settingMenuList: SettingMenuItem[] = [
  { name: 'ContactsHome', label: 'Contacts', index: 0, icon: 'settingsAddressBook' },
  { name: 'SecurityAndPrivacy', label: 'Security & Privacy', index: 1, icon: 'settingsSecurity' },
  { name: 'InnerSettings', label: 'General', index: 2, icon: 'settingsSetting' },
  // { name: 'HelpAndFeedBack', label: 'Help & Feedback', index: 4, icon: 'settingsHelp' },
  { name: 'AboutUs', label: 'About Us', index: 5, icon: 'settingsAboutUs' },
];
