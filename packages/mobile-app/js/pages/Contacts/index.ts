import ContactsDetail from './ContactsDetail';
import ContactsHome from './ContactsHome';
import QrScanner from './QrScanner';

const stackNav = [
  { name: 'ContactsDetail', component: ContactsDetail },
  {
    name: 'ContactsHome',
    component: ContactsHome,
  },
  { name: 'QrScanner', component: QrScanner },
] as const;

export default stackNav;
