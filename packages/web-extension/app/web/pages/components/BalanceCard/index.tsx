import { useGetELFRateQuery } from '@portkey/store/rate/api';
import CustomSvg from 'components/CustomSvg';
import BigNumber from 'bignumber.js';
import './index.less';
import { unitConverter } from '@portkey/utils/converter';
import { useAppSelector } from 'store/Provider/hooks';
import checkMain from 'utils/util.isMain';
import { useTranslation } from 'react-i18next';

export interface BalanceCardProps {
  accountInfo?: any;
  amount?: BigNumber;
  symbol?: string;
  onSend?: () => void;
  onReceive?: () => void;
}

export default function BalanceCard({ amount, symbol, onSend, onReceive }: BalanceCardProps) {
  const { t } = useTranslation();
  const { data } = useGetELFRateQuery({}, { pollingInterval: 1000 * 60 * 60 });
  const { currentChain } = useAppSelector((state) => state.chain);
  const isMain = checkMain(currentChain.netWorkType, currentChain.chainId);

  return (
    <div className="balance-card">
      <div className="balance-amount">
        {symbol === 'ELF' ? (
          <CustomSvg type="Aelf" style={{ width: 32, height: 32 }} />
        ) : (
          <div className="custom-word-logo">{(symbol && symbol[0]) || ''}</div>
        )}

        <span className="amount">
          {unitConverter(amount)} {symbol || 'ELF'}
        </span>
        {isMain && <span className="convert">${unitConverter(amount?.multipliedBy(data?.USDT || 0))} USD</span>}
      </div>
      <div className="balance-btn">
        <span className="send btn" onClick={onSend}>
          <CustomSvg type="RightTop" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Send')}</span>
        </span>
        <span className="receive btn" onClick={onReceive}>
          <CustomSvg type="RightDown" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Receive')}</span>
        </span>
      </div>
    </div>
  );
}
