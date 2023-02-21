import { ZERO } from '@portkey/constants/misc';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { divDecimals, unitConverter } from '@portkey/utils/converter';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export default function TokenList({ tokenList }: { tokenList: TokenItemShowType[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'Testnet' : ''), [currentNetwork]);

  const onNavigate = useCallback(
    (tokenInfo: TokenItemShowType) => {
      navigate('/token-detail', { state: tokenInfo });
    },
    [navigate],
  );

  const handleAddToken = useCallback(() => {
    navigate('/add-token');
    return;
  }, [navigate]);

  return (
    <>
      <ul className="token-list">
        {tokenList.map((item) => (
          <li className="token-list-item" key={`${item.chainId}_${item.symbol}`} onClick={() => onNavigate(item)}>
            {item.symbol === 'ELF' ? (
              <CustomSvg className="token-logo" type="Aelf" />
            ) : (
              <div className="token-logo custom-word-logo">{item.symbol?.slice(0, 1)}</div>
            )}
            <div className="info">
              <span>{item.symbol}</span>
              <span>
                {item.chainId.toLowerCase() === 'aelf' ? 'MainChain' : 'SideChain'} {`${item.chainId} ${isTestNet}`}
              </span>
            </div>
            <div className="amount">
              <p>{unitConverter(divDecimals(item.balance, item.decimals || 8))}</p>
              {!isTestNet && (
                <p className="convert">{`$ ${unitConverter(divDecimals(item.balanceInUsd, item.decimals || 8))}`}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div>
        <div className="add-token-enter-btn" onClick={handleAddToken}>
          <CustomSvg type="PlusFilled" className="plus-filled" />
          <span>{t('Add Tokens')}</span>
        </div>
      </div>
    </>
  );
}
