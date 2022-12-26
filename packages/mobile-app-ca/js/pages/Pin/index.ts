import SetPin from './SetPin';
import CheckPin from './CheckPin';
import ConfirmPin from './ConfirmPin';
import SetBiometrics from './SetBiometrics';
const stackNav = [
  { name: 'SetPin', component: SetPin },
  { name: 'ConfirmPin', component: ConfirmPin },
  { name: 'SetBiometrics', component: SetBiometrics },
  { name: 'CheckPin', component: CheckPin },
] as const;

export default stackNav;
