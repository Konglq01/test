import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { SendTokenQRDataType } from '@portkey-wallet/types/types-ca/qrcode';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import { useIsTestnet } from 'hooks/useNetwork';
import QRCode from 'qrcode.react';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export default function Receive() {
  const navigate = useNavigate();
  const { symbol } = useParams();
  const { state } = useLocation();
  const wallet = useCurrentWalletInfo();
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useIsTestnet();
  const caAddress = useMemo(
    () => `ELF_${wallet?.[state.chainId || 'AELF']?.caAddress}_${state.chainId}`,
    [state, wallet],
  );
  console.log('---receive', state);

  const rightElement = useMemo(() => {
    return (
      <div>
        <CustomSvg onClick={() => navigate(-1)} type="Close2" />
      </div>
    );
  }, [navigate]);

  const value: SendTokenQRDataType = useMemo(
    () => ({
      type: 'send',
      sendType: 'token',
      netWorkType: currentNetwork,
      chainType: 'aelf',
      toInfo: {
        address: caAddress,
        name: '',
      },
      assetInfo: {
        symbol: state.symbol as string,
        chainId: state.chainId as ChainId,
        balance: state.balance as string,
        imageUrl: state.imageUrl as string,
        tokenContractAddress: state.address,
        balanceInUsd: state.balanceInUsd,
        decimals: state.decimals,
      },
      address: caAddress,
    }),
    [caAddress, currentNetwork, state],
  );
  console.log('-----qr', value);

  return (
    <div className="receive-wrapper">
      <TitleWrapper leftElement rightElement={rightElement} />
      <div className="receive-content">
        <div className={clsx(['single-account'])}>
          <div className="name">My Wallet Address to Receive</div>
        </div>
        <div className="token-info">
          {symbol === 'ELF' ? <CustomSvg type="elf-icon" /> : <div className="icon">{symbol?.[0]}</div>}
          <p className="symbol">{symbol}</p>
          <p className="network">{transNetworkText(state.chainId, isTestNet)}</p>
        </div>
        <QRCode
          imageSettings={{ src: 'assets/svgIcon/PortkeyQR.svg', height: 20, width: 20, excavate: true }}
          value={JSON.stringify(value)}
          // eslint-disable-next-line no-inline-styles/no-inline-styles
          style={{ width: 200, height: 200 }}
        />
        <div className="receive-address">
          <div className="address">{caAddress}</div>
          <Copy className="copy-icon" toCopy={caAddress}></Copy>
        </div>
      </div>
    </div>
  );
}
