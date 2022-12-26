import ManageNetwork from '.';
import NetworkDetails from './NetworkDetails';

const stackNav = [
  {
    name: 'ManageNetwork',
    label: '网络管理',
    component: ManageNetwork,
  },
  { name: 'NetworkDetails', component: NetworkDetails },
] as const;

export default stackNav;
