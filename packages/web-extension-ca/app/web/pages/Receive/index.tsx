import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { SendTokenQRDataType } from '@portkey/types/types-ca/qrcode';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import QRCode from 'qrcode.react';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export default function Receive() {
  const navigate = useNavigate();
  const { symbol, chainId } = useParams();
  const wallet = useCurrentWalletInfo();
  const { currentNetwork } = useWalletInfo();
  const isMainChain = useMemo(() => chainId?.toLowerCase() === 'aelf', [chainId]);
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'Testnet' : ''), [currentNetwork]);
  const { state } = useLocation();
  const caAddress = useMemo(() => `ELF_${wallet?.[chainId || 'AELF'].caAddress}_${chainId}`, [chainId, wallet]);

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
      toCaAddress: caAddress,
      netWorkType: currentNetwork,
      chainType: 'aelf',
      address: state?.address,
      tokenInfo: {
        ...state,
      },
    }),
    [caAddress, currentNetwork, state],
  );

  return (
    <div className="receive-wrapper">
      <TitleWrapper leftElement rightElement={rightElement} />
      <div className="receive-content">
        <div className={clsx(['single-account'])}>
          <div className="name">My Wallet Address to Receive</div>
        </div>
        <div className="token-info">
          {symbol === 'ELF' ? <CustomSvg type="Aelf" /> : <div className="icon">{symbol?.[0]}</div>}
          <p className="symbol">{symbol}</p>
          <p className="network">{`${isMainChain ? 'MainChain' : 'SideChain'} ${chainId} ${isTestNet}`}</p>
        </div>
        <QRCode
          imageSettings={{ src: 'assets/svgIcon/PortKey.svg', height: 30, width: 30, excavate: true }}
          value={JSON.stringify(value)}
          // eslint-disable-next-line no-inline-styles/no-inline-styles
          style={{ width: 140, height: 140 }}
        />
        <div className="receive-address">
          <div className="address">{caAddress}</div>
          <Copy className="copy-icon" toCopy={caAddress}></Copy>
        </div>
      </div>
    </div>
  );
}
