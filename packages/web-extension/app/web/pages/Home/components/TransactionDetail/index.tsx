import { ZERO } from '@portkey-wallet/constants/misc';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { unitConverter } from '@portkey-wallet/utils/converter';
import CustomSvg from 'components/CustomSvg';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { shortenCharacters } from 'utils/reg';
import checkMain from 'utils/util.isMain';
import { Transaction } from '../MyBalance';
import './index.less';

export default function TransactionDetail({
  rate,
  info,
  onClose,
}: {
  rate: any;
  info?: Transaction;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const currentNetwork = useCurrentNetwork();
  const { nativeCurrency, chainId, netWorkType, blockExplorerURL } = currentNetwork;
  const isMain = checkMain(netWorkType, chainId);

  return info ? (
    <div className="transaction-detail-modal">
      <div className="header">
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <div className="transaction-info">
        <div className="method-wrap">
          <CustomSvg type={info.method === 'Transfer' ? 'Transfer' : 'Transaction'} />
          <p className="method-name">{info.method}</p>
        </div>
        <div className="status-wrap">
          <p className="label">
            <span className="left">{t('Status')}</span>
            <span className="right">{t('Date')}</span>
          </p>
          <p className="value">
            <span className="left">{t('Success')}</span>
            <span className="right">{moment(info.time).format('MMM D [at] h:m a')}</span>
          </p>
        </div>
        <div className="account-wrap">
          <p className="label">
            <span className="left">{t('From')}</span>
            <span className="right">{t('To')}</span>
          </p>
          <div className="value">
            <span className="left">{shortenCharacters(info.address_from)}</span>
            <CustomSvg type="RightArrow" />
            <span className="right">{shortenCharacters(info.address_to)}</span>
          </div>
        </div>
        <div className="money-wrap">
          <p className="label">
            <span className="left">{t('Transaction')}</span>
          </p>
          <div>
            <p className="value">
              <span className="left">{t('Amount')}</span>
              <span className="right">{`${unitConverter(
                ZERO.plus(info?.quantity ?? 0).div(Math.pow(10, nativeCurrency?.decimals || 8)),
              )} ELF`}</span>
            </p>
            <p className="value">
              <span className="left">{t('Transaction Fee')}</span>
              <span className="right">{`${unitConverter(
                ZERO.plus(info?.tx_fee ?? 0).div(Math.pow(10, nativeCurrency?.decimals || 8)),
              )} ELF`}</span>
            </p>
            <div className="total-amount value">
              <span className="left">{t('Total Amount')}</span>
              <p className="right">
                <span className="total">{`${unitConverter(
                  ZERO.plus(info?.tx_fee ?? 0)
                    .plus(info?.quantity ?? 0)
                    .div(Math.pow(10, nativeCurrency?.decimals || 8)),
                )} ELF`}</span>
                {isMain && (
                  <span className="convert">{`$${unitConverter(
                    ZERO.plus(info?.tx_fee ?? 0)
                      .plus(info?.quantity ?? 0)
                      .multipliedBy(rate?.USDT || 0)
                      .div(Math.pow(10, nativeCurrency?.decimals || 8)),
                  )} USD`}</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <a
          className="link"
          target="blank"
          href={`${blockExplorerURL}${blockExplorerURL?.slice(-1) === '/' ? '' : '/'}tx/${info.tx_id}`}>
          {t('View on Explorer')}
        </a>
      </div>
    </div>
  ) : (
    <></>
  );
}
