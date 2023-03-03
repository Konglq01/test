import { useParams } from 'react-router';
import EditContact from '../EditContact';
import ViewContact from '../ViewContact';

export default function Contact() {
  const { type } = useParams();

  return (
    <div>
      {type === 'view' && <ViewContact />}
      {(type === 'edit' || type === 'add') && <EditContact />}
    </div>
  );
}
