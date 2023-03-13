import DeviceUnlock from '.';
import DeviceList from './DeviceList';

const stackNav = [
  {
    name: 'DeviceUnlock',
    component: DeviceUnlock,
  },
  {
    name: 'DeviceList',
    component: DeviceList,
  },
] as const;

export default stackNav;
