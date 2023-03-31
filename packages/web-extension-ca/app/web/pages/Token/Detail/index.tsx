import { useLocation, useNavigate } from 'react-router';
import './index.less';
import SettingHeader from 'pages/components/SettingHeader';
import BalanceCard from 'pages/components/BalanceCard';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import Activity from 'pages/Home/components/Activity';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsTestnet } from 'hooks/useNetwork';
import clsx from 'clsx';
import { useCommonState } from 'store/Provider/hooks';
import { useCallback } from 'react';
import PromptFrame from 'pages/components/PromptFrame';

export enum TokenTransferStatus {
  CONFIRMED = 'Confirmed',
  SENDING = 'Sending',
}

function TokenDetail() {
  const navigate = useNavigate();
  const { state: currentToken } = useLocation();
  const isTestNet = useIsTestnet();
  const { isPrompt } = useCommonState();

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['token-detail', isPrompt ? 'portkey-body' : ''])}>
        <div className="token-detail-title">
          <SettingHeader
            title={
              <div className="title">
                <p className="symbol">{currentToken?.symbol}</p>
                <p className="network">{transNetworkText(currentToken.chainId, isTestNet)}</p>
              </div>
            }
            leftCallBack={() => navigate(-1)}
          />
        </div>
        <div className="token-detail-content">
          <div className="balance">
            <div className="balance-amount">
              <span className="amount">
                {formatAmountShow(divDecimals(currentToken.balance, currentToken.decimals || 8))} {currentToken.symbol}
              </span>
              {!isTestNet && (
                <span className="convert">
                  $ {formatAmountShow(divDecimals(currentToken.balanceInUsd, currentToken.decimals || 8), 2)}
                </span>
              )}
            </div>
            <BalanceCard
              amount={currentToken?.balanceInUsd}
              onSend={() => {
                navigate(`/send/token/${currentToken?.symbol}`, {
                  state: { ...currentToken, address: currentToken?.tokenContractAddress },
                });
              }}
              onReceive={() =>
                navigate(`/receive/token/${currentToken?.symbol}`, {
                  state: { ...currentToken, address: currentToken.tokenContractAddress },
                })
              }
            />
          </div>
        </div>
        <div className="token-detail-history">
          <Activity chainId={currentToken.chainId} symbol={currentToken.symbol} />
        </div>
      </div>
    );
  }, [currentToken, isPrompt, isTestNet, navigate]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}

export default TokenDetail;
