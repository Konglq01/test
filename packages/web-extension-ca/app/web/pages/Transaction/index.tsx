import { ZERO } from '@portkey/constants/misc';
import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { Transaction } from '@portkey/types/types-ca/trade';
import { unitConverter } from '@portkey/utils/converter';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useWalletInfo } from 'store/Provider/hooks';
import { shortenCharacters } from 'utils/reg';
import './index.less';

export default function Transaction() {
  const { t } = useTranslation();
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => currentNetwork === 'TESTNET', [currentNetwork]);
  const { state }: { state: ActivityItemType } = useLocation();

  const isFromMainChain = useMemo(() => state.fromChainId === 'AELF', [state.fromChainId]);
  const isToMainChain = useMemo(() => state.toChainId === 'AELF', [state.toChainId]);
  const nav = useNavigate();
  const isNft = true;
  const onClose = useCallback(() => {
    nav(-1);
  }, [nav]);

  return state ? (
    <div className="transaction-detail-modal">
      <div className="header">
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <div className="transaction-info">
        <div className="method-wrap">
          <p className="method-name">{state.transactionType}</p>
          {!isNft ? (
            <div className="nft-amount">
              <div className="avatar">
                <p>K</p>
              </div>
              <div className="info">
                <p className="index">
                  <span>{state.nftInfo?.nftId}</span>
                  <span className="token-id">#0004</span>
                </p>
                <p className="quantity">Amount: 3</p>
              </div>
            </div>
          ) : (
            <p className="amount">
              {state.amount} {state.symbol}
              <span className="usd">{state.priceInUsd}</span>
            </p>
          )}
        </div>
        <div className="status-wrap">
          <p className="label">
            <span className="left">{t('Status')}</span>
            <span className="right">{t('Date')}</span>
          </p>
          <p className="value">
            <span className="left">{t(state.status)}</span>
            <span className="right">{moment(Number(state.timestamp)).format('MMM D [at] h:m a')}</span>
          </p>
        </div>
        <div className="account-wrap">
          <p className="label">
            <span className="left">{t('From')}</span>
            <span className="right">{t('To')}</span>
          </p>
          <div className="value">
            <div className="content">
              <span className="left name">{state.from}</span>
              <span className="left">{shortenCharacters(state.fromAddress)}</span>
            </div>
            <CustomSvg type="RightArrow" />
            <div className="content">
              <span className="right name">{state.to}</span>
              <span className="right">{shortenCharacters(state.toAddress)}</span>
            </div>
          </div>
        </div>
        <div className="network-wrap">
          <p className="label">
            <span className="left">{t('Network')}</span>
          </p>
          <p className="value">{`${isFromMainChain ? 'MainChain' : ''} ${state.fromChainId} ${
            isTestNet ? 'Testnet ' : ''
          }-> ${isToMainChain ? 'MainChain' : ''} ${state.toChainId} ${isTestNet ? ' Testnet' : ''}`}</p>
        </div>
        <div className="money-wrap">
          <p className="label">
            <span className="left">{t('Transaction')}</span>
          </p>
          <div>
            <p className="value">
              <span className="left">{t('Transaction ID')}</span>
              <span className="right tx-id">
                {state.transactionId.replace(/(?<=^\w{7})\w*(?=\w{4}$)/, '...')} <Copy toCopy={state.transactionId} />
              </span>
            </p>
            <p className="value">
              <span className="left">{t('Transaction Fee')}</span>
              <span className="right">{`${unitConverter(ZERO.plus(state.transactionFees.fee))} ${
                state.transactionFees.symbol
              }`}</span>
            </p>
          </div>
        </div>
        <a className="link" target="blank" href={`tx/${state.transactionId}`}>
          {t('View on Explorer')}
        </a>
      </div>
    </div>
  ) : (
    <></>
  );
}
