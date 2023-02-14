import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { unitConverter } from '@portkey/utils/converter';
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
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? currentNetwork : ''), [currentNetwork]);

  const onNavigate = useCallback(
    (tokenInfo: TokenItemShowType) => {
      console.log(tokenInfo);

      navigate('/token-detail', { state: { tokenInfo } });
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
        {/* {tokenList.map((item) => (
          <li className="token-list-item" key={item.token.chainId} onClick={() => onNavigate(item)}>
            {item.token.symbol === 'ELF' ? (
              <CustomSvg className="token-logo" type="Aelf" />
            ) : (
              <div className="token-logo custom-word-logo">{(item.token.symbol && item.token.symbol[0]) || ''}</div>
            )}
            <div className="info">
              <span>{item.token.symbol}</span>
              <span>
                {item.chainId.toLowerCase() === 'aelf' ? 'MainChain' : 'SideChain'} {`${item.chainId} Testnet`}
              </span>
            </div>
            <div className="amount">
              <p>{unitConverter(item.amount)}</p>
              {isTestNet === 'TESTNET' || <p className="convert">$ {unitConverter(item.amountUsd)}</p>}
            </div>
          </li>
        ))} */}
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
