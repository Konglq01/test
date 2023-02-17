import { ZERO } from '@portkey/constants/misc';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { getChainIdByAddress } from '@portkey/utils';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export default function SendPreview({
  amount,
  symbol,
  toAccount,
  transactionFee,
  type,
}: {
  amount: string;
  symbol: string;
  toAccount: { name?: string; address: string };
  transactionFee: string | number;
  type?: 'nft' | 'token';
}) {
  const { walletName, currentNetwork, walletInfo } = useWalletInfo();
  const networkInfo = useCurrentNetworkInfo();
  const isTestNet = useMemo(() => currentNetwork === 'TESTNET', [currentNetwork]);
  return (
    <div className="send-preview">
      {type !== 'nft' ? (
        <div className="amount-preview">
          <p className="amount">
            {amount} {symbol}
          </p>
          <p className="convert">{isTestNet ? '' : `$ ${amount}`}</p>
        </div>
      ) : (
        <div className="amount-preview nft">
          <div className="avatar">
            <p>K</p>
          </div>
          <div className="info">
            <p className="index">
              <span>Knight of Swords</span>
              <span className="token-id">#0004</span>
            </p>
            <p className="quantity">
              Balance: <span>{3}</span>
            </p>
          </div>
        </div>
      )}
      <div className="address-preview">
        <div className="item">
          <span className="label">From</span>
          <div className="value">
            <p className="name">{walletName}</p>
            <p className="address">{walletInfo?.address}</p>
          </div>
        </div>
        <div className={clsx('item', toAccount.name?.length || 'no-name')}>
          <span className="label">To</span>
          <div className="value">
            {toAccount.name?.length && <p className="name">{toAccount.name}</p>}
            <p className="address">
              {toAccount.address.includes('ELF_')
                ? toAccount.address.replace(/(?<=^\w{9})\w+(?=\w{10})/, '...')
                : toAccount.address.replace(/(?<=^\w{6})\w+(?=\w{6})/, '...')}
            </p>
          </div>
        </div>
        <div className="item network">
          <span>Network</span>
          <div>
            <p>{`${networkInfo.name} ${getChainIdByAddress(walletInfo?.address || '', networkInfo.walletType)}->${
              networkInfo.name
            } ${getChainIdByAddress(toAccount.address, networkInfo.walletType)}`}</p>
          </div>
        </div>
      </div>
      <div className="fee-preview">
        <span className="label">Transaction fee</span>
        <p className="value">
          <span className="symbol">
            {transactionFee || 0} {symbol}
          </span>
          <span className="usd">{`$ ${ZERO}`}</span>
        </p>
      </div>
    </div>
  );
}
