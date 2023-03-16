import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import DividerCenter from '../DividerCenter';
import SocialContent from '../SocialContent';
import TermsOfServiceItem from '../TermsOfServiceItem';
import './index.less';

export default function SocialLogin({ loginByInput }: { loginByInput: () => void }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="card-content">
        <h1 className="title">
          Login
          <CustomSvg type="QRCode" onClick={() => navigate('/register/start/scan')} />
        </h1>
        <div className="social-login-content">
          <SocialContent
            type="Login"
            onFinish={(v) => {
              console.log(v, 'onFinish===SocialContent');
            }}
          />
          <DividerCenter />
          <Button type="primary" className="login-by-input-btn" onClick={() => loginByInput()}>
            Login with Phone / Email
          </Button>
          <div className="go-sign-up">
            <span>No account?</span>
            <span className="sign-text" onClick={() => navigate('/register/start/create')}>
              Sign up
            </span>
          </div>
        </div>
      </div>
      <TermsOfServiceItem />
    </>
  );
}
