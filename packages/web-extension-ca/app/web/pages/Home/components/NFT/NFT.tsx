import { Collapse } from 'antd';
import { List } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useWalletInfo } from 'store/Provider/hooks';

import './index.less';

export default function NFT() {
  const nav = useNavigate();
  const { currentNetwork } = useWalletInfo();
  const [noData, SetNoData] = useState(false);
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? currentNetwork : ''), [currentNetwork]);
  return (
    <div className="tab-nft">
      {noData ? (
        <p className="empty-text">No NFTs yet</p>
      ) : (
        <List className="nft-list">
          <List.Item>
            <Collapse>
              <Collapse.Panel
                key={'1'}
                header={
                  <div className="protocol">
                    <div className="avatar">{'M'}</div>
                    <div className="info">
                      <p className="alias">Mini Kove</p>
                      <p className="network">MainChain AELF {isTestNet}</p>
                    </div>
                    <div className="amount">3</div>
                  </div>
                }>
                <div className="list">
                  <div
                    className="item"
                    onClick={() => {
                      nav('/nft', { state: { info: {} } });
                    }}>
                    <div className="mask">
                      <p className="alias">Knight of Swords 123123</p>
                      <p className="token-id">#0003</p>
                    </div>
                  </div>
                  <div
                    className="item with-img"
                    onClick={() => {
                      nav('/nft', { state: { info: {} } });
                    }}>
                    <div className="mask">
                      <p className="alias">Knight of Swords 123123</p>
                      <p className="token-id">#0003</p>
                    </div>
                  </div>
                  <p className="load-more">
                    <CustomSvg type="Down" /> More
                  </p>
                </div>
              </Collapse.Panel>
            </Collapse>
          </List.Item>
        </List>
      )}
    </div>
  );
}
