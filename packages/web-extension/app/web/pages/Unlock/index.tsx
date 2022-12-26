import { useNavigate } from 'react-router';
import LockPage from '../components/LockPage';

const Unlock = () => {
  const navigate = useNavigate();
  return (
    <div>
      <LockPage onUnLockHandler={() => navigate('/')} />
    </div>
  );
};
export default Unlock;
