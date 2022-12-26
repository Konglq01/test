import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import EmailLogin from '../EmailLogin';

export default function LoginCard() {
  const navigate = useNavigate();
  return (
    <div className="login-card">
      <h2 className="title">
        Login
        <CustomSvg type="QRCode" onClick={() => navigate('/register/start/scan')} />
      </h2>
      <div className="login-content">
        <EmailLogin />
        <Button className="sign-btn" onClick={() => navigate('/register/start/create')}>
          Sign up
        </Button>
      </div>
    </div>
  );
}
