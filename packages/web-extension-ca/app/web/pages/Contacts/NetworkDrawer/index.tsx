import { DrawerProps } from 'antd';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import BaseDrawer from 'components/BaseDrawer';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import './index.less';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsTestnet } from 'hooks/useActivity';

interface CustomSelectProps extends DrawerProps {
  onChange: (v: Record<string, string>) => void;
  onClose: () => void;
}

export default function NetworkDrawer({ onChange, onClose, ...props }: CustomSelectProps) {
  const { t } = useTranslation();
  const [filterWord, setFilterWord] = useState<string>('');
  const [showNetworkLists, setShowNetworkLists] = useState<any[]>([]);
  const { chainList, currentNetwork } = useCurrentWallet();
  const isTestNet = useIsTestnet();
  const symbolImages = useSymbolImages();

  const networkLists = useMemo(
    () =>
      chainList?.map((chain) => ({
        networkType: currentNetwork,
        chainId: chain.chainId,
        networkName: transNetworkText(chain.chainId, isTestNet),
      })),
    [chainList, currentNetwork, isTestNet],
  );

  useEffect(() => {
    if (!filterWord) {
      setShowNetworkLists(networkLists || []);
    } else {
      const filter = (networkLists || []).filter((l) => l.networkName.toLowerCase() === filterWord.toLowerCase());
      setShowNetworkLists(filter);
    }
  }, [filterWord, networkLists]);

  return (
    <BaseDrawer {...props} onClose={onClose} className="switch-network-drawer">
      <div className="header">
        <p>{t('Select Network')}</p>
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <DropdownSearch
        overlayClassName="switch-network-empty-dropdown"
        open={false}
        overlay={<></>}
        inputProps={{
          onChange: (e) => {
            const _value = e.target.value;
            setFilterWord(_value);
          },
          placeholder: t('Search Network'),
        }}
      />
      <div className="list">
        {showNetworkLists.map((net) => (
          <div
            className="item"
            key={`${net.networkType}_${net.chainId}`}
            onClick={() => {
              onChange(net);
            }}>
            <img src={symbolImages['ELF']} />
            <div className="info">{net?.networkName}</div>
          </div>
        ))}
        {!!filterWord && !showNetworkLists.length && (
          <div className="flex-center no-search-result">{t('There is no search result.')}</div>
        )}
      </div>
    </BaseDrawer>
  );
}
