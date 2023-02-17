import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.less';
import SettingHeader from 'pages/components/SettingHeader';
import BalanceCard from 'pages/components/BalanceCard';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { divDecimals, unitConverter } from '@portkey/utils/converter';
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
  const currentChain = useMemo(
    () => (currentToken?.chainId.toLocaleLowerCase() === 'aelf' ? 'MainChain' : 'SideChain'),
    [currentToken],
  );

  useEffect(() => {
    const { tokenInfo } = state;
    tokenInfo && setCurrentToken(tokenInfo);
  }, [state, symbol]);

  console.log(currentToken, 'currentToken===');

  return (
    <div className="token-detail">
      <SettingHeader
        title={
          <div className="title">
            <p className="symbol">{currentToken?.symbol}</p>
            <p className="network">{`${currentChain} ${currentToken?.chainId} ${isMain || 'Testnet'}`}</p>
          </div>
        }
        leftCallBack={() => navigate(-1)}
      />
      <div className="token-detail-content">
        <div className="balance">
          <div className="balance-amount">
            <span className="amount">
              {unitConverter(divDecimals(currentToken?.balance, currentToken?.decimal || 8))} {currentToken?.symbol}
            </span>
            {isMain && <span className="convert">$ {unitConverter(currentToken?.balanceInUsd)}</span>}
          </div>
          <BalanceCard
            amount={currentToken?.balanceInUsd}
            onSend={() => {
              navigate(`/send/token/${currentToken?.symbol}/${currentToken?.id ?? ''}`);
            }}
            onReceive={() => navigate(`/receive/${currentToken?.symbol}/${currentToken?.chainId}`)}
          />
        </div>
      </div>
      <div className="token-detail-history">
        <ActivityList hasMore={false} loadMore={() => new Promise(() => '1')} />
      </div>
    </div>
  );
}

export default TokenDetail;
