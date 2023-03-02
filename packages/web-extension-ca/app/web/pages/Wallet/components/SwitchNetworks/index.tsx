import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { NetworkType } from '@portkey-wallet/types';
import { useAppDispatch } from 'store/Provider/hooks';
import { changeNetworkType } from '@portkey-wallet/store/store-ca/wallet/actions';
import CustomSvg from 'components/CustomSvg';
import './index.less';

interface Network {
  key: string;
  name: string;
  walletType: string;
  networkType: NetworkType;
  disabled: boolean;
}

export default function SwitchNetwork() {
  const { t } = useTranslation();
  const appDispatch = useAppDispatch();
  const [curNet, setCurNet] = useState<string>('aelf-Testnet');

  const allNetworkType: Network[] = useMemo(
    () => [
      {
        key: 'aelf-Testnet',
        name: 'aelf Testnet',
        walletType: 'aelf',
        networkType: 'TESTNET',
        disabled: false,
      },
      {
        key: 'aelf-Mainnet',
        name: 'aelf Mainnet',
        walletType: 'aelf',
        networkType: 'MAIN',
        disabled: true,
      },
    ],
    [],
  );

  const handleChangeNet = useCallback(
    (net: Network) => {
      if (!net.disabled) {
        setCurNet(net.key);
        appDispatch(changeNetworkType(net.networkType));
      }
    },
    [appDispatch],
  );

  return (
    <div className="flex-column switch-networks-drawer">
      {allNetworkType.map((net) => (
        <div
          key={net.key}
          className={clsx('network-item', net.disabled ? 'disabled' : '')}
          onClick={() => handleChangeNet(net)}>
          <div className="network-item-checked">
            {curNet === net.key && <CustomSvg type="selected" className="selected-svg" />}
          </div>
          <div className="network-item-icon">
            <CustomSvg type="Aelf" />
          </div>
          {t(net.name)}
        </div>
      ))}
    </div>
  );
}
