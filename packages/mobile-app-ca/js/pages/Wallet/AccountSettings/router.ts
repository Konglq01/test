import AccountSettings from '.';
import Biometric from './Biometric';
import Devices from './Devices';

const stackNav = [
  {
    name: 'AccountSettings',
    component: AccountSettings,
  },
  {
    name: 'Biometric',
    component: Biometric,
  },
  {
    name: 'Devices',
    component: Devices,
  },
] as const;

export default stackNav;
