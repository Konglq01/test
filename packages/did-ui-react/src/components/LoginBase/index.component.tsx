import { useMemo, useState, useCallback } from 'react';
import { Button } from 'antd';
import CustomSvg from '../CustomSvg';
import EmailLogin from '../EmailLogin';
import { CreateWalletType } from '../types';
import CommonSelect from '../CommonSelect';
import ConfigProvider from '../config-provider';
import { NetworkItem } from '@portkey/types/types-ca/network';
import './index.less';

export interface LoginBaseProps {
  network?: string;
  networkList?: NetworkItem[];
  onLogin?: (value: string) => void;
  inputValidator?: (value?: string) => Promise<any>;
  onStep?: (value: CreateWalletType) => void;
  onNetworkChange?: (network: string) => void;
}

export default function LoginBase({
  network,
  networkList,
  inputValidator,
  onLogin,
  onStep,
  onNetworkChange,
}: LoginBaseProps) {
  const configNetwork = useMemo(() => ConfigProvider.config?.network, []);

  const _networkList = useMemo(() => networkList || configNetwork?.networkList, [configNetwork, networkList]);
  const _network = useMemo(
    () => network || configNetwork?.defaultNetwork || _networkList?.[0]?.networkType,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_networkList, network],
  );

  const [currentNetwork, setNetwork] = useState<string | undefined>(_network);

  const selectItems = useMemo(
    () =>
      _networkList?.map((item) => ({
        value: item.networkType,
        icon: item?.networkIconUrl ? <img src={item?.networkIconUrl} /> : <CustomSvg type="Aelf" />,
        label: item.name,
        disabled: !item.isActive,
      })),
    [_networkList],
  );

  const networkChange = useCallback(
    (value: string) => {
      setNetwork(value);
      onNetworkChange?.(value);
    },
    [onNetworkChange],
  );

  return (
    <div className="flex-column login-ui-card">
      <div className="login-content">
        <h2 className="login-title">
          Login
          <CustomSvg type="QRCode" onClick={() => onStep?.('LoginByScan')} />
        </h2>
        <EmailLogin inputValidator={inputValidator} onLogin={onLogin} />
        <Button className="sign-btn" onClick={() => onStep?.('SignUp')}>
          Sign up
        </Button>
      </div>

      <div className="network-list-wrapper">
        <CommonSelect
          className="network-list-select"
          placement="topLeft"
          value={currentNetwork}
          items={selectItems}
          onChange={networkChange}
          style={{ width: 366 }}
          showArrow={false}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
        />
      </div>
    </div>
  );
}
