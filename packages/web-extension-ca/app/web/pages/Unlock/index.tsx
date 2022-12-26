import RegisterHeader from 'pages/components/RegisterHeader';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import LockPage from '../components/LockPage';

const Unlock = () => {
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  return (
    <div>
      <LockPage header={isPrompt && <RegisterHeader />} onUnLockHandler={() => navigate('/')} />
    </div>
  );
};
export default Unlock;
