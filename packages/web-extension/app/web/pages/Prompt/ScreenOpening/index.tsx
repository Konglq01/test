import ScreenOpening from 'components/ScreenOpening';
import { useNavigate } from 'react-router';

export default function ScreenOpeningPage() {
  const navigate = useNavigate();
  return <ScreenOpening className="fix-max-content" onFinish={() => navigate('/register/start')} />;
}
