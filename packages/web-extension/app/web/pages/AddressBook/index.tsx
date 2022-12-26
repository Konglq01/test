import { useCommonState } from 'store/Provider/hooks';
import AddressBookInPopup from './components/AddressBookInPopup';
import AddressBookInPrompt from './components/AddressBookInPrompt';
import './index.less';

export default function AddressBook() {
  const { isPrompt } = useCommonState();
  return isPrompt ? <AddressBookInPrompt /> : <AddressBookInPopup />;
}
