import { TransactionTypes } from '@portkey/constants/constants-ca/activity';
import { ZERO } from '@portkey/constants/misc';
import { TransactionStatus } from '@portkey/graphql/contract/__generated__/types';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { fetchActivity } from '@portkey/store/store-ca/activity/api';
import { IActivityApiParams } from '@portkey/store/store-ca/activity/type';
import { ActivityItemType, TransactionFees } from '@portkey/types/types-ca/activity';
import { Transaction } from '@portkey/types/types-ca/trade';
import { unitConverter } from '@portkey/utils/converter';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useWalletInfo } from 'store/Provider/hooks';
import { shortenCharacters } from 'utils/reg';
import './index.less';

export default function Transaction() {
  const { t } = useTranslation();
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'TESTNET' : ''), [currentNetwork]);
  const { state }: { state: IActivityApiParams } = useLocation();
  const currentWallet = useCurrentWallet();
  const {
    walletInfo: { caAddressList },
  } = currentWallet;

  const [activityItem, setActivityItem] = useState<ActivityItemType>();
  const [feeInfo, setFeeInfo] = useState<TransactionFees[]>([]);

  useEffectOnce(() => {
    const params = {
      caAddresses: caAddressList,
      transactionId: state.transactionId,
      blockHash: state.blockHash,
    };
    fetchActivity(params)
      .then((res) => {
        setActivityItem(res);
        setFeeInfo(res.transactionFees);
      })
      .catch((error) => {
        throw Error(JSON.stringify(error));
      });
  });

  const status = useMemo(() => {
    if (activityItem?.status === TransactionStatus.Mined)
      return {
        text: 'Confirmed',
        style: 'confirmed',
      };
    return {
      text: 'Failed',
      style: 'failed',
    };
  }, [activityItem]);

  const nav = useNavigate();
  const onClose = useCallback(() => {
    nav(-1);
  }, [nav]);

  const networkUI = () => {
    /* Hidden during [SocialRecovery, AddManager, RemoveManager] */
    const { transactionType, fromChainId, toChainId } = activityItem || {};
    const from = fromChainId === 'AELF' ? 'MainChain AELF' : `SideChain ${fromChainId}`;
    const to = toChainId === 'AELF' ? 'MainChain AELF' : `SideChain ${toChainId}`;
    const hiddenArr = [TransactionTypes.SOCIAL_RECOVERY, TransactionTypes.ADD_MANAGER, TransactionTypes.REMOVE_MANAGER];

    return (
      transactionType &&
      !hiddenArr.includes(transactionType) && (
        <div className="network-wrap">
          <p className="label">
            <span className="left">{t('Network')}</span>
          </p>
          <p className="value">{`${from} ${isTestNet}->${to} ${isTestNet}`}</p>
        </div>
      )
    );
  };

  const isNft = activityItem?.nftInfo?.nftId;
  const nftHeaderUI = () => {
    const { nftInfo, amount } = activityItem || {};
    return (
      <div className="nft-amount">
        <div className="avatar" style={{ backgroundImage: nftInfo?.imageUrl }}>
          <p>{!nftInfo?.imageUrl ? nftInfo?.alias?.slice(0, 1) : ''}</p>
        </div>
        <div className="info">
          <p className="index">
            <span>{nftInfo?.alias}</span>
            <span className="token-id">#{nftInfo?.nftId}</span>
          </p>
          <p className="quantity">Amount: {amount}</p>
        </div>
      </div>
    );
  };

  const tokenHeaderUI = () => {
    const { amount, decimal, symbol, priceInUsd } = activityItem || {};
    return (
      <p className="amount">
        {unitConverter(ZERO.plus(amount || 0).div(`1e${decimal}`))} {symbol}
        {!isTestNet && <span className="usd">$ {unitConverter(ZERO.plus(priceInUsd ?? 0), 2)}</span>}
      </p>
    );
  };

  const feeUI = () => {
    const { fee, symbol, feeInUsd } = feeInfo[0]; // todoykx
    const { decimal } = activityItem || {};
    console.log('fee feeinfo', JSON.stringify(feeInfo));
    console.log('fee decimal', decimal);
    symbol;
    return (
      <p className="value">
        <span className="left">{t('Transaction Fee')}</span>
        <span className="right">
          <span>{`${unitConverter(ZERO.plus(fee || 0).div(`1e${decimal}`))} ${symbol}`}</span>
          {!isTestNet && (
            <span className="right-usd">$ {unitConverter(ZERO.plus(feeInUsd ?? 0).div(`1e${decimal}`), 2)}</span>
          )}
        </span>
      </p>
    );
  };

  return activityItem ? (
    <div className="transaction-detail-modal">
      <div className="header">
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <div className="transaction-info">
        <div className="method-wrap">
          <p className="method-name">{activityItem.transactionType}</p>
          {isNft ? nftHeaderUI() : tokenHeaderUI()}
        </div>
        <div className="status-wrap">
          <p className="label">
            <span className="left">{t('Status')}</span>
            <span className="right">{t('Date')}</span>
          </p>
          <p className="value">
            <span className={clsx(['left', status.style])}>{t(status.text)}</span>
            <span className="right">{moment(Number(activityItem.timestamp)).format('MMM D [at] h:m a')}</span>
          </p>
        </div>
        <div className="account-wrap">
          <p className="label">
            <span className="left">{t('From')}</span>
            <span className="right">{t('To')}</span>
          </p>
          <div className="value">
            <div className="content">
              <span className="left name">{activityItem.from}</span>
              <span className="left">{shortenCharacters(activityItem.fromAddress)}</span>
            </div>
            <CustomSvg type="RightArrow" />
            <div className="content">
              <span className="right name">{activityItem.to}</span>
              <span className="right">{shortenCharacters(activityItem.toAddress)}</span>
            </div>
          </div>
        </div>
        {networkUI()}
        <div className="money-wrap">
          <p className="label">
            <span className="left">{t('Transaction')}</span>
          </p>
          <div>
            <p className="value">
              <span className="left">{t('Transaction ID')}</span>
              <span className="right tx-id">
                {activityItem.transactionId.replace(/(?<=^\w{7})\w*(?=\w{4}$)/, '...')}{' '}
                <Copy toCopy={activityItem.transactionId} />
              </span>
            </p>
            {feeUI()}
          </div>
        </div>
        <a className="link" target="blank" href={`tx/${activityItem.transactionId}`}>
          {t('View on Explorer')}
        </a>
      </div>
    </div>
  ) : (
    <></>
  );
}
