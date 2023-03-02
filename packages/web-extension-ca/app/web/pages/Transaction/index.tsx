import { TransactionTypes, transactionTypesMap } from '@portkey/constants/constants-ca/activity';
import { TransactionStatus } from '@portkey/graphql/contract/__generated__/types';
import { useCaAddresses, useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { fetchActivity } from '@portkey/store/store-ca/activity/api';
import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { Transaction } from '@portkey/types/types-ca/trade';
import { getExploreLink } from '@portkey/utils';
import { AmountSign, formatAmount, transNetworkText } from '@portkey/utils/activity';
import { formatStr2EllipsisStr } from '@portkey/utils/converter';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useEffectOnce } from 'react-use';
import { shortenCharacters } from 'utils/reg';
import './index.less';
import { useIsTestnet } from 'hooks/useActivity';
import { dateFormat } from 'utils';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';

export interface ITransactionQuery {
  item: ActivityItemType;
  chainId?: string;
}

export default function Transaction() {
  const { t } = useTranslation();
  const { state }: { state: ITransactionQuery } = useLocation();
  const chainId = state.chainId;
  const currentWallet = useCurrentWallet();
  const { walletInfo } = currentWallet;
  const caAddresses = useCaAddresses();
  const caAddress = chainId ? [walletInfo[chainId]?.caAddress] : '';
  const isTestNet = useIsTestnet();

  // Obtain data through routing to ensure that the page must have data and prevent Null Data Errors.
  const [activityItem, setActivityItem] = useState<ActivityItemType>(state.item);
  const feeInfo = useMemo(() => activityItem.transactionFees, [activityItem.transactionFees]);
  const chainInfo = useCurrentChain(activityItem.fromChainId);

  // Obtain data through api to ensure data integrity.
  // Because some data is not returned in the Activities API. Such as from, to.
  useEffectOnce(() => {
    const params = {
      caAddresses: caAddress || caAddresses,
      transactionId: activityItem.transactionId,
      blockHash: activityItem.blockHash,
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
    // TODO: do not use GraphQL TransactionStatus
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

  const isNft = useMemo(() => !!activityItem?.nftInfo?.nftId, [activityItem?.nftInfo?.nftId]);

  const nftHeaderUI = useCallback(() => {
    const { nftInfo, amount } = activityItem;
    return (
      <div className="nft-amount">
        <div
          className="assets"
          style={{
            backgroundImage: `url(${nftInfo?.imageUrl})`,
          }}>
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
    const { amount, isReceived, decimals, symbol, priceInUsd } = activityItem;
    const sign = isReceived ? AmountSign.PLUS : AmountSign.MINUS;
    return (
      <p className="amount">
        {`${formatAmount({ amount, decimals, sign })} ${symbol ?? ''}`}
        {!isTestNet && (
          <span className="usd">{`$ ${formatAmount({ amount: priceInUsd, decimals: 0, digits: 2 })}`}</span>
        )}
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
          <span className="right">{dateFormat(activityItem.timestamp)}</span>
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
    const { transactionType, fromChainId, toChainId } = activityItem;
    const from = transNetworkText(fromChainId, isTestNet);
    const to = transNetworkText(toChainId, isTestNet);
    const hiddenArr = [TransactionTypes.SOCIAL_RECOVERY, TransactionTypes.ADD_MANAGER, TransactionTypes.REMOVE_MANAGER];

    return (
      transactionType &&
      !hiddenArr.includes(transactionType) && (
        <div className="network-wrap">
          <p className="label">
            <span className="left">{t('Network')}</span>
          </p>
          <p className="value">{`${from}->${to}`}</p>
        </div>
      )
    );
  }, [activityItem, isTestNet, t]);

  const feeUI = useCallback(() => {
    return (
      <p className="value">
        <span className="left">{t('Transaction Fee')}</span>
        <span className="right">
          {(!feeInfo || feeInfo?.length === 0) && <div className="right-item">0 ELF</div>}
          {feeInfo?.length > 0 &&
            feeInfo.map((item, idx) => {
              return (
                <div key={'transactionFee' + idx} className="right-item">
                  <span>{`${formatAmount({ amount: item.fee, decimals: isNft ? 8 : activityItem.decimals })} ${
                    item.symbol ?? ''
                  }`}</span>
                  {!isTestNet && (
                    <span className="right-usd">
                      $ {formatAmount({ amount: item.feeInUsd, decimals: activityItem.decimals, digits: 2 })}
                    </span>
                  )}
                </div>
              );
            })}
        </span>
      </p>
    );
  }, [activityItem.decimals, feeInfo, isNft, isTestNet, t]);

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
    return getExploreLink(chainInfo?.explorerUrl || '', activityItem.transactionId || '', 'transaction');
  }, [activityItem.transactionId, chainInfo?.explorerUrl]);

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
          <p className="method-name">
            {transactionTypesMap(activityItem.transactionType, activityItem.nftInfo?.nftId)}
          </p>
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
