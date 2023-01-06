import { Button, message } from 'antd';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import MyBalance from './components/MyBalance';
import './index.less';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';

export default function Home() {
  const navigate = useNavigate();
  const currentChain = useCurrentChain();
  const wallet = useCurrentWallet();
  // 2A7tQJt8LgTPDvExTRSKdXQxgKWBcudSaUgBSkh7BPwxbHHMNw
  console.log(wallet, 'walletInfo==');
  const TestCode = (
    <Button
      onClick={async () => {
        // await InternalMessage.payload(InternalMessageTypes.SET_SEED, '11111111').send();

        if (!currentChain?.endPoint) return message.error('error');
        try {
          //
        } catch (error) {
          console.log(error, 'error====addGuardian');
        }
      }}>
      Check
    </Button>
  );

  const onUserClick = useCallback(() => {
    navigate(`/setting`);
  }, [navigate]);

  return (
    <div className="portkey-home">
      <PortKeyHeader onUserClick={onUserClick} />
      <div className="portkey-home-body">
        <MyBalance />
        {TestCode}
        {/* <SettingDrawer
          open={visible}
          onClose={() => setVisible(false)}
          onMenuClick={(router) => navigate(`/setting/${router}`)}
        /> */}
      </div>
    </div>
  );
}
