import Entrance from './Entrance';
import SignupPortkey from './SignupPortkey';
import LoginPortkey from './LoginPortkey';
import ScanLogin from './ScanLogin';
const stackNav = [
  { name: 'Entrance', component: Entrance },
  { name: 'SignupPortkey', component: SignupPortkey },
  { name: 'LoginPortkey', component: LoginPortkey },
  { name: 'ScanLogin', component: ScanLogin },
] as const;

export default stackNav;
