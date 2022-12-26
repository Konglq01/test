import ContactsHome from './ContactsHome';
import QrScanner from './QrScanner';
import ContactEdit from './ContactEdit';
import ContactDetail from './ContactDetail';

const stackNav = [
  { name: 'ContactsHome', component: ContactsHome },
  { name: 'ContactEdit', component: ContactEdit },
  { name: 'ContactDetail', component: ContactDetail },
  { name: 'QrScanner', component: QrScanner },
] as const;

export default stackNav;
