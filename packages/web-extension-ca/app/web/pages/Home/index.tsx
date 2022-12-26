import { Button } from 'antd';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import MyBalance from './components/MyBalance';
import './index.less';
import { useCommonState } from 'store/Provider/hooks';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import './index.less';

export default function Home() {
  const navigate = useNavigate();
  const TestCode = (
    <Button
      onClick={async () => {
        // await InternalMessage.payload(InternalMessageTypes.SET_SEED, '11111111').send();
        const seed = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
        console.log(seed, 'Check==');
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
        {/* {TestCode} */}
        {/* <SettingDrawer
          open={visible}
          onClose={() => setVisible(false)}
          onMenuClick={(router) => navigate(`/setting/${router}`)}
        /> */}
      </div>
    </div>
  );
}
