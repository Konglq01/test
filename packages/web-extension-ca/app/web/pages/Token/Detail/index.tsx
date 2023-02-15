import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.less';
import SettingHeader from 'pages/components/SettingHeader';
import BalanceCard from 'pages/components/BalanceCard';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { unitConverter } from '@portkey/utils/converter';
import ActivityList from 'pages/components/ActivityList';
import { useWalletInfo } from 'store/Provider/hooks';

export enum TokenTransferStatus {
  CONFIRMED = 'Confirmed',
  SENDING = 'Sending',
}

function TokenDetail() {
  const navigate = useNavigate();
  const [currentToken, setCurrentToken] = useState<TokenItemShowType>();
  const { symbol } = useParams();
  const { currentNetwork } = useWalletInfo();
  const { state } = useLocation();
  const isMain = useMemo(() => currentNetwork === 'MAIN', [currentNetwork]);

  useEffect(() => {
    const { tokenInfo } = state;
    tokenInfo && setCurrentToken(tokenInfo);
  }, [state, symbol]);

  return (
    <div className="token-detail">
      <SettingHeader
        title={
          <div className="title">
            {/* <p className="symbol">{currentToken?.token.symbol}</p> */}
            <p className="network">MainChain AELF {isMain || 'Testnet'}</p>
          </div>
        }
        leftCallBack={() => navigate(-1)}
      />
      <div className="token-detail-content">
        <div className="balance">
          <div className="balance-amount">
            {/* <span className="amount">
              {unitConverter(currentToken?.amount)} {currentToken?.token.symbol}
            </span> */}
            {/* {isMain && <span className="convert">$ {unitConverter(currentToken?.amountUsd)}</span>} */}
          </div>
          {/* <BalanceCard
            amount={currentToken?.amountUsd}
            onSend={() => {
              navigate(`/send/${currentToken?.token.symbol}`);
            }}
            onReceive={() => navigate(`/receive/${currentToken?.token.symbol}/${currentToken?.token.chainId}`)}
          /> */}
        </div>
      </div>
      <div className="token-detail-history">
        <ActivityList hasMore={false} loadMore={() => new Promise(() => '1')} />
      </div>
    </div>
  );
}

export default TokenDetail;
