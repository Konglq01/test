import { Button } from 'antd';
import SettingHeader from 'pages/components/SettingHeader';
import { useNavigate } from 'react-router';

import './index.less';

export default function NFT() {
  const navigate = useNavigate();
  return (
    <div className="nft-detail">
      <SettingHeader leftCallBack={() => navigate(-1)} />
      <div className="picture">{'K'}</div>
      <div className="info">
        <p className="alias">
          {'Knight of Swords'} #{'0004'}
        </p>
        <p className="amount">Amount: {2}</p>
        <p className="label">Symbol information</p>
        <p className="information">Symbol information Symbol information Symbol information</p>
      </div>
      <div className="btn-wrap">
        <Button type="primary" onClick={() => navigate('/send/nft/symbol/tokenId')}>
          Send
        </Button>
      </div>
    </div>
  );
}
