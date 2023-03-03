import { ZERO } from '@portkey-wallet/constants/misc';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { TokenItemType } from '@portkey-wallet/types/types-eoa/token';
import { unitConverter } from '@portkey-wallet/utils/converter';
import CustomSvg from 'components/CustomSvg';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAppSelector } from 'store/Provider/hooks';
import checkMain from 'utils/util.isMain';

export default function Assets({ tokenList, rate }: { tokenList: TokenItemType[]; rate: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetwork();
  const { currentChain } = useAppSelector((state) => state.chain);
  const { currentAccount } = useAppSelector((state) => state.wallet);
  const { balances } = useAppSelector((state) => state.tokenBalance);
  const { netWorkType, chainId } = currentNetwork;
  const isMain = checkMain(netWorkType, chainId);
  const getBalance = useCallback(
    (symbol: string, decimals = 8) =>
      ZERO.plus(balances?.[currentChain.rpcUrl]?.[currentAccount?.address ?? '']?.[symbol] ?? 0).div(`1e${decimals}`),
    [balances, currentAccount?.address, currentChain.rpcUrl],
  );
  return (
    <>
      <ul className="token-list">
        {tokenList.map((item) => (
          <li
            className="token-list-item"
            key={item.symbol}
            onClick={() => navigate(`/token/detail/${item.symbol}/${item.address}`)}>
            {item.symbol === 'ELF' ? (
              <CustomSvg className="token-logo" type="Aelf" style={{ width: 32, height: 32 }} />
            ) : (
              <div className="token-logo custom-word-logo">{(item.symbol && item.symbol[0]) || ''}</div>
            )}
            <div className="amount">
              <span>
                {unitConverter(getBalance(item.symbol, item.decimals))}&nbsp;
                {item.symbol}
              </span>
              {isMain && (
                <span>${unitConverter(getBalance(item.symbol, item.decimals).multipliedBy(rate?.USDT))} USD</span>
              )}
            </div>
            <CustomSvg className="right" type="Right" style={{ width: 16, height: 16 }} />
          </li>
        ))}
      </ul>
      <div>
        <div className="add-token-enter-btn" style={{ textAlign: 'center' }} onClick={() => navigate('/token/manage')}>
          <CustomSvg type="PlusFilled" style={{ width: 20, height: 20 }} />
          <span>{t('Add Tokens')}</span>
        </div>
      </div>
    </>
  );
}
