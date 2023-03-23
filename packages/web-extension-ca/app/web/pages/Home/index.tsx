import clsx from 'clsx';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import MyBalance from './components/MyBalance';
import './index.less';

export default function Home() {
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();

  const onUserClick = useCallback(() => {
    navigate(`/setting`);
  }, [navigate]);

  return (
    <div className={clsx(['portkey-home', isPrompt ? 'portkey-prompt' : null])}>
      <PortKeyHeader onUserClick={onUserClick} />
      <div className="portkey-home-body">
        <MyBalance />
      </div>
    </div>
  );
}
