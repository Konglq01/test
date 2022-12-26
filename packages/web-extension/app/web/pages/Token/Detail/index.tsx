import { useCallback, useState, useEffect, useMemo } from 'react';
import { useCurrentAccountTokenList } from '@portkey/hooks/hooks-eoa/useToken';
import { useNavigate, useParams } from 'react-router';
import { useAppSelector } from 'store/Provider/hooks';
import { TokenItemType } from '@portkey/types/types-eoa/token';
import { ZERO } from '@portkey/constants/misc';
import './index.less';
import SettingHeader from 'pages/components/SettingHeader';
import BalanceCard from 'pages/components/BalanceCard';
import PromptCommonPage from 'pages/components/PromptCommonPage';
import { useTranslation } from 'react-i18next';

export enum TokenTransferStatus {
  CONFIRMED = 'Confirmed',
  SENDING = 'Sending',
}

function TokenDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentToken, setCurrentToken] = useState<TokenItemType>();
  const { currentChain } = useAppSelector((state) => state.chain);
  const { currentAccount } = useAppSelector((state) => state.wallet);
  const { balances } = useAppSelector((state) => state.tokenBalance);
  const localTokenList = useCurrentAccountTokenList();
  const { symbol } = useParams();

  useEffect(() => {
    const token = localTokenList.find((item) => item.symbol === symbol);
    token && setCurrentToken(token);
  }, [localTokenList, symbol]);

  const balanceFormat = useCallback(
    (symbol: string, decimals = 8) =>
      ZERO.plus(balances?.[currentChain.rpcUrl]?.[currentAccount?.address ?? '']?.[symbol] ?? 0).div(`1e${decimals}`),
    [balances, currentAccount?.address, currentChain.rpcUrl],
  );

  const historyHref = useMemo(
    () =>
      currentChain?.blockExplorerURL &&
      currentToken?.symbol &&
      `${currentChain?.blockExplorerURL}/token/${currentToken?.symbol}`,
    [currentChain.blockExplorerURL, currentToken?.symbol],
  );

  return (
    <PromptCommonPage>
      <div className="token-detail">
        <SettingHeader title={currentToken?.symbol} leftCallBack={() => navigate(-1)} />
        <div className="token-detail-content">
          <div className="balance">
            <BalanceCard
              amount={balanceFormat(currentToken?.symbol || '', currentToken?.decimals || 8)}
              symbol={currentToken?.symbol}
              onSend={() => {
                navigate(`/send/${currentToken?.symbol ?? 'ELF'}/${currentChain?.nativeCurrency?.address}`);
              }}
              onReceive={() => navigate('/receive')}
            />
          </div>
        </div>
        <div className="token-detail-history">
          <a className={!historyHref ? 'disabled' : ''} href={historyHref} target="_blank" rel="noopener noreferrer">
            {t('View full history on Explorer')}
          </a>
        </div>
      </div>
    </PromptCommonPage>
  );
}

export default TokenDetail;
