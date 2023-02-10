import accountSettingsNav from './AccountSettings/router';
import WalletHomeNav from './WalletHome/router';

const stackNav = [...WalletHomeNav, ...accountSettingsNav] as const;

export default stackNav;
