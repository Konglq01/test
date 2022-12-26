import { Button } from 'antd';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import SettingDrawer from 'components/SettingDrawer';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import AccountEdit from '../components/AccountEdit';
import MyBalance from './components/MyBalance';
import './index.less';
import { useCommonState } from 'store/Provider/hooks';

export default function Home() {
  const [visible, setVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const testCode = useMemo(
    () => (
      <div>
        <Button
          onClick={() => {
            console.log('first');
            const a = chrome.extension.getViews({ type: 'popup' });
            console.log(a, 'first');
          }}>
          getAllWindow
        </Button>
      </div>
    ),
    [],
  );

  const onUserClick = useCallback(() => {
    isPrompt ? navigate(`/setting`) : setVisible(true);
  }, [isPrompt, navigate]);

  return (
    <div className="portkey-home">
      <PortKeyHeader onUserClick={onUserClick} />
      <div className="portkey-home-body">
        <AccountEdit />
        <MyBalance />
        {/* {testCode} */}
        <SettingDrawer
          open={visible}
          onClose={() => setVisible(false)}
          onMenuClick={(router) => navigate(`/setting/${router}`)}
        />
      </div>
    </div>
  );
}
