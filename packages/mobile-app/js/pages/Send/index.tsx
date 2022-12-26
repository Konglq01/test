import SendHome from './SendHome';
import SelectContact from './SelectContact';

const stackNav = [
  { name: 'SendHome', component: SendHome },
  { name: 'SelectContact', component: SelectContact },
] as const;

export default stackNav;
