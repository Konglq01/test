import { TokenBaseItemType } from '@portkey/types/types-ca/assets';
import { unitConverter } from '@portkey/utils/converter';
import { message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router';
import { useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export default function TokenList({ tokenList }: { tokenList: TokenBaseItemType[] }) {
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? currentNetwork : ''), [currentNetwork]);

  const onNavigate = useCallback((tokenInfo: TokenBaseItemType) => {
    console.log(tokenInfo);

    message.info('Coming soon. Check back here for updates', 1);
    return;
    // navigate('/token-detail', { state: { tokenInfo } });
  }, []);

  const handleAddToken = useCallback(() => {
    message.info('Coming soon. Check back here for updates', 1);
    // navigate('/add-token');
    return;
  }, []);

  return (
    <>
      <ul className="token-list">
        {tokenList.map((item) => (
          <li className="token-list-item" key={item.token.symbol} onClick={() => onNavigate(item)}>
            {item.token.symbol === 'ELF' ? (
              <CustomSvg className="token-logo" type="Aelf" />
            ) : (
              <div className="token-logo custom-word-logo">{(item.token.symbol && item.token.symbol[0]) || ''}</div>
            )}
            <div className="info">
              <span>{item.token.symbol}</span>
              <span>
                {item.chainId.toLowerCase() === 'aelf' ? 'MainChain' : 'SideChain'} {item.chainId} {isTestNet}
              </span>
            </div>
            <div className="amount">
              <p>{unitConverter(item.amount)}</p>
              {isTestNet === 'TESTNET' || <p className="convert">$ {unitConverter(item.amountUsd)}</p>}
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
