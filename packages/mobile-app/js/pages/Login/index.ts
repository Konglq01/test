import Entrance from './Entrance';
import CreateWallet from './CreateWallet';
import CreateSuccess from './CreateSuccess';
import ImportWallet from './ImportWallet';
const stackNav = [
  { name: 'Entrance', component: Entrance },
  { name: 'CreateWallet', component: CreateWallet },
  { name: 'CreateSuccess', component: CreateSuccess },
  { name: 'ImportWallet', component: ImportWallet },
] as const;

export default stackNav;
