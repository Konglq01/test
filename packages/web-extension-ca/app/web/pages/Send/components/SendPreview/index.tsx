import { ZERO } from '@portkey/constants/misc';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { getChainIdByAddress } from '@portkey/utils';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import { useTokenPrice } from '@portkey/hooks/hooks-ca/useTokensPrice';
import './index.less';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { CROSS_FEE } from '@portkey/constants/constants-ca/wallet';
import { unitConverter } from '@portkey/utils/converter';
import { isAelfAddress } from '@portkey/utils/aelf';

export default function SendPreview({
  amount,
  symbol,
  toAccount,
  transactionFee,
  type,
  imageUrl,
  chainId,
  isCross,
  tokenId,
}: {
  amount: string;
  symbol: string;
  imageUrl: string;
  toAccount: { name?: string; address: string };
  transactionFee: string | number;
  type: 'nft' | 'token';
  chainId: string;
  isCross: boolean;
  tokenId: string;
}) {
  const { walletName, currentNetwork, walletInfo } = useWalletInfo();
  const wallet = useCurrentWalletInfo();
  const networkInfo = useCurrentNetworkInfo();
  const isTestNet = useMemo(() => currentNetwork === 'TESTNET', [currentNetwork]);
  const ElfPrice = useTokenPrice(['ELF']);
  const isMain = useMemo(() => (chainId === 'AELF' ? 'MainChain' : 'SideChain'), [chainId]);
  const txFee = useMemo(() => {
    if (isCross && symbol === 'ELF') {
      return unitConverter(ZERO.plus(CROSS_FEE).plus(transactionFee).toNumber());
    } else {
      return transactionFee;
    }
  }, [isCross, symbol, transactionFee]);
  const toChain = useMemo(() => {
    const arr = toAccount.address.split('_');
    if (isAelfAddress(arr[arr.length - 1])) {
      return 'AELF';
    }
    return arr[arr.length - 1];
  }, [toAccount.address]);

  return (
    <div className="send-preview">
      {type !== 'nft' ? (
        <div className="amount-preview">
          <p className="amount">
            -{unitConverter(amount)} {symbol}
          </p>
          <p className="convert">{isTestNet ? '' : `$ ${amount}`}</p>
        </div>
      ) : (
        <div className="amount-preview nft">
          <div className="avatar">{imageUrl ? <img src={imageUrl} /> : <p>{symbol?.slice(0, 1)}</p>}</div>
          <div className="info">
            <p className="index">
              <span>{symbol}</span>
              <span className="token-id">{`#${tokenId}`}</span>
            </p>
            <p className="quantity">
              Balance: <span>{unitConverter(amount)}</span>
            </p>
          </div>
        </div>
      )}
      <div className="address-preview">
        <div className="item">
          <span className="label">From</span>
          <div className="value">
            <p className="name">{walletName}</p>
            <p className="address">
              {wallet[chainId].caAddress.includes('ELF_')
                ? wallet[chainId].caAddress.replace(/(?<=^\w{9})\w+(?=\w{10})/, '...')
                : wallet[chainId].caAddress.replace(/(?<=^\w{6})\w+(?=\w{6})/, '...')}
            </p>
          </div>
        </div>
        <div className={clsx('item', toAccount.name?.length || 'no-name')}>
          <span className="label">To</span>
          <div className="value">
            {!!toAccount.name?.length && <p className="name">{toAccount.name}</p>}
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
            <p>{`${isMain} ${chainId}->${toChain === 'AELF' ? 'MainChain' : 'SideChain'} ${toChain}`}</p>
          </div>
        </div>
      </div>
      <div className="fee-preview">
        <span className="label">Transaction fee</span>
        <p className="value">
          <span className="symbol">{`${unitConverter(txFee)} ELF`}</span>
          {/* <span className="usd">{`$ ${ZERO.plus(ElfPrice[0]).times(txFee).toFixed(2)}`}</span> */}
        </p>
      </div>
      {isCross && symbol === 'ELF' && (
        <div className="fee-preview">
          <span className="label">Estimated Amount Received</span>
          <p className="value">
            <span className="symbol">{`${
              ZERO.plus(amount).isLessThanOrEqualTo(ZERO.plus(CROSS_FEE))
                ? '0'
                : unitConverter(ZERO.plus(amount).minus(ZERO.plus(CROSS_FEE)))
            } ELF`}</span>
          </p>
        </div>
      )}
    </div>
  );
}
