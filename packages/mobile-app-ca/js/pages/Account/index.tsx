import ChangePassword from './ChangePassword';
import CheckPassword from './CheckPassword';
import ImportAccount from './ImportAccount';
import Mnemonic from './Mnemonic';
import MnemonicConfirmation from './MnemonicConfirmation';
import ShowMnemonic from './ShowMnemonic';
import ShowPrivateKey from './ShowPrivateKey';
const stackNav = [
  { name: 'Mnemonic', component: Mnemonic },
  { name: 'ChangePassword', component: ChangePassword },
  { name: 'ImportAccount', component: ImportAccount },
  { name: 'ShowMnemonic', component: ShowMnemonic },
  { name: 'ShowPrivateKey', component: ShowPrivateKey },
  { name: 'MnemonicConfirmation', component: MnemonicConfirmation },
  { name: 'CheckPassword', component: CheckPassword },
] as const;

export default stackNav;
