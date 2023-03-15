import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import MyBalance from './components/MyBalance';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';

export default function Home() {
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();

  const onUserClick = useCallback(() => {
    const url = isPrompt ? `/setting/wallet` : `/setting`;
    navigate(url);
  }, [isPrompt, navigate]);

  return (
    <div className="portkey-home">
      <PortKeyHeader onUserClick={onUserClick} />
      <div className="portkey-home-body">
        <MyBalance />
      </div>
    </div>
  );
}
