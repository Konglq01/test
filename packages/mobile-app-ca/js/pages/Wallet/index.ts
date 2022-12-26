import WalletHome from './WalletHome';
import WalletName from './WalletName';
import SwitchNetworks from './SwitchNetworks';
import AutoLock from './AutoLock';
import AboutUs from './AboutUs';

const stackNav = [
  { name: 'WalletHome', component: WalletHome },
  { name: 'WalletName', component: WalletName },
  { name: 'SwitchNetworks', component: SwitchNetworks },
  { name: 'AutoLock', component: AutoLock },
  { name: 'AboutUs', component: AboutUs },
] as const;

export default stackNav;
