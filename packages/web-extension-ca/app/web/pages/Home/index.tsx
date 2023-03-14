import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import MyBalance from './components/MyBalance';
import './index.less';

export default function Home() {
  const navigate = useNavigate();

  const onUserClick = useCallback(() => {
    navigate(`/setting/wallet`);
  }, [navigate]);

  return (
    <div className="portkey-home">
      <PortKeyHeader onUserClick={onUserClick} />
      <div className="portkey-home-body">
        <MyBalance />
      </div>
    </div>
  );
}
