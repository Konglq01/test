import { TransactionTypes } from '@portkey/constants/constants-ca/activity';
import { ZERO } from '@portkey/constants/misc';
import { TransactionStatus } from '@portkey/graphql/contract/__generated__/types';
import { useCaAddresses } from '@portkey/hooks/hooks-ca/wallet';
import { fetchActivity } from '@portkey/store/store-ca/activity/api';
import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { Transaction } from '@portkey/types/types-ca/trade';
import { getExploreLink } from '@portkey/utils';
import { formatStr2EllipsisStr, unitConverter } from '@portkey/utils/converter';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import moment from 'moment';
import { useCurrentNetwork } from '@portkey/hooks/network';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useWalletInfo } from 'store/Provider/hooks';
import { shortenCharacters } from 'utils/reg';
import './index.less';

const DEFAULT_DECIMAL = 8;

export default function Transaction() {
  const { t } = useTranslation();
  const { state }: { state: ActivityItemType } = useLocation();
  const caAddresses = useCaAddresses();
  const { blockExplorerURL } = useCurrentNetwork();

  // Obtain data through routing to ensure that the page must have data and prevent Null Data Errors.
  const [activityItem, setActivityItem] = useState<ActivityItemType>(state);
  const feeInfo = useMemo(() => activityItem.transactionFees, [activityItem.transactionFees]);

  // Obtain data through api to ensure data integrity.
  // Because some data is not returned in the Activities API. Such as from, to.
  useEffectOnce(() => {
    const params = {
      caAddresses,
      transactionId: state.transactionId,
      blockHash: state.blockHash,
    };
    fetchActivity(params)
      .then((res) => {
        setActivityItem(res);
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

  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'TESTNET' : ''), [currentNetwork]);
  const isNft = useMemo(() => !!activityItem?.nftInfo?.nftId, [activityItem?.nftInfo?.nftId]);

  const nftHeaderUI = useCallback(() => {
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
          <p className="quantity">{`Amount: ${amount}`}</p>
        </div>
      </div>
    );
  }, [activityItem]);

  const tokenHeaderUI = useCallback(() => {
    const { amount, decimals, symbol, priceInUsd } = activityItem || {};
    return (
      <p className="amount">
        {`${unitConverter(ZERO.plus(amount || 0).div(`1e${decimals ?? DEFAULT_DECIMAL}`))} `}
        {symbol}
        {!isTestNet && <span className="usd">{`$ ${unitConverter(ZERO.plus(priceInUsd ?? 0), 2)}`}</span>}
      </p>
    );
  }, [activityItem, isTestNet]);

  const statusAndDateUI = useCallback(() => {
    return (
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
    );
  }, [activityItem.timestamp, status.style, status.text, t]);

  const fromToUI = useCallback(() => {
    return (
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
    );
  }, [activityItem.from, activityItem.fromAddress, activityItem.to, activityItem.toAddress, t]);

  const networkUI = useCallback(() => {
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
  }, [activityItem, isTestNet, t]);

  const feeUI = useCallback(() => {
    return (
      <p className="value">
        <span className="left">{t('Transaction Fee')}</span>
        <span className="right">
          {feeInfo?.map((item, idx) => {
            return (
              <div key={'transactionFee' + idx} className="right-item">
                <span>{`${unitConverter(
                  ZERO.plus(item.fee || 0).div(`1e${activityItem?.decimals ?? DEFAULT_DECIMAL}`),
                )} ${item.symbol}`}</span>
                {!isTestNet && (
                  <span className="right-usd">
                    ${' '}
                    {unitConverter(
                      ZERO.plus(item.feeInUsd ?? 0).div(`1e${activityItem?.decimals ?? DEFAULT_DECIMAL}`),
                      2,
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </span>
      </p>
    );
  }, [activityItem?.decimals, feeInfo, isTestNet, t]);

  const transactionUI = useCallback(() => {
    return (
      <div className="money-wrap">
        <p className="label">
          <span className="left">{t('Transaction')}</span>
        </p>
        <div>
          <p className="value">
            <span className="left">{t('Transaction ID')}</span>
            <span className="right tx-id">
              {`${formatStr2EllipsisStr(activityItem.transactionId, [7, 4])} `}
              <Copy toCopy={activityItem.transactionId} />
            </span>
          </p>
          {feeUI()}
        </div>
      </div>
    );
  }, [activityItem.transactionId, feeUI, t]);

  const openOnExplorer = useCallback(() => {
    return getExploreLink(blockExplorerURL || '', activityItem.transactionId || '', 'transaction');
  }, [activityItem.transactionId, blockExplorerURL]);

  const viewOnExplorerUI = useCallback(() => {
    return (
      <a className="link" target="blank" href={openOnExplorer()}>
        {t('View on Explorer')}
      </a>
    );
  }, [openOnExplorer, t]);

  return (
    <div className="transaction-detail-modal">
      <div className="header">
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <div className="transaction-info">
        <div className="method-wrap">
          <p className="method-name">{activityItem.transactionType}</p>
          {isNft ? nftHeaderUI() : tokenHeaderUI()}
        </div>
        {statusAndDateUI()}
        {fromToUI()}
        {networkUI()}
        {transactionUI()}
        {viewOnExplorerUI()}
      </div>
    </div>
  );
}
