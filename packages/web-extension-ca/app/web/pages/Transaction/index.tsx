import { ZERO } from '@portkey/constants/misc';
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
  const { state } = useLocation();
  const nav = useNavigate();
  const { info }: { info: Transaction } = state;
  const isNft = false;
  const onClose = useCallback(() => {
    nav(-1);
  }, [nav]);

  return info ? (
    <div className="transaction-detail-modal">
      <div className="header">
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <div className="transaction-info">
        <div className="method-wrap">
          <p className="method-name">{info.method}</p>
          {isNft ? (
            <div className="nft-amount">
              <div className="avatar">
                <p>K</p>
              </div>
              <div className="info">
                <p className="index">
                  <span>Knight of Swords</span>
                  <span className="token-id">#0004</span>
                </p>
                <p className="quantity">Amount: 3</p>
              </div>
            </div>
          ) : (
            <p className="amount">
              {info.amount} {info.token.symbol}
              <span className="usd">$ 0</span>
            </p>
          )}
        </div>
        <div className="status-wrap">
          <p className="label">
            <span className="left">{t('Status')}</span>
            <span className="right">{t('Date')}</span>
          </p>
          <p className="value">
            <span className="left">{t('Success')}</span>
            <span className="right">{moment(Number(info.timestamp)).format('MMM D [at] h:m a')}</span>
          </p>
        </div>
        <div className="account-wrap">
          <p className="label">
            <span className="left">{t('From')}</span>
            <span className="right">{t('To')}</span>
          </p>
          <div className="value">
            <div className="content">
              <span className="left name">Wallet 1</span>
              <span className="left">{shortenCharacters(info.from)}</span>
            </div>
            <CustomSvg type="RightArrow" />
            <div className="content">
              <span className="right name">Sally</span>
              <span className="right">{shortenCharacters(info.to)}</span>
            </div>
          </div>
        </div>
        <div className="network-wrap">
          <p className="label">
            <span className="left">{t('Network')}</span>
          </p>
          <p className="value">{`MainChain AELF ${isTestNet ? 'Testnet ' : ''}-> MainChain AELF${
            isTestNet ? ' Testnet' : ''
          }`}</p>
        </div>
        <div className="money-wrap">
          <p className="label">
            <span className="left">{t('Transaction')}</span>
          </p>
          <div>
            <p className="value">
              <span className="left">{t('Transaction ID')}</span>
              <span className="right tx-id">
                {info.transactionId.replace(/(?<=^\w{7})\w*(?=\w{4}$)/, '...')} <Copy toCopy={info.transactionId} />
              </span>
            </p>
            <p className="value">
              <span className="left">{t('Transaction Fee')}</span>
              <span className="right">{`${unitConverter(ZERO.plus(0))} ELF`}</span>
            </p>
          </div>
        </div>
        <a className="link" target="blank" href={`tx/${info.transactionId}`}>
          {t('View on Explorer')}
        </a>
      </div>
    </div>
  ) : (
    <></>
  );
}
