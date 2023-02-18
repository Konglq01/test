import { SendTokenQRDataType } from '@portkey/types/types-ca/qrcode';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import QRCode from 'qrcode.react';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTokenInfo, useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export default function Receive() {
  const navigate = useNavigate();
  const { symbol, chainId } = useParams();
  const { currentNetwork } = useWalletInfo();
  const { tokenDataShowInMarket } = useTokenInfo();
  const isMainChain = useMemo(() => chainId?.toLowerCase() === 'aelf', [chainId]);
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'Testnet' : ''), [currentNetwork]);
  const receiveAddress = useMemo(() => {
    const adr =
      tokenDataShowInMarket.filter((item) => item.chainId === chainId && item.symbol === symbol)?.[0].address || '';
    return adr ? `ELF_${adr}_${chainId}` : '';
  }, [chainId, symbol, tokenDataShowInMarket]);
  const { state } = useLocation();

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
      toCaAddress: state?.address,
      netWorkType: currentNetwork,
      chainType: 'aelf',
      address: state?.address,
      tokenInfo: {
        ...state,
      },
    }),
    [currentNetwork, state],
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
          // imageSettings={{ src: '../', height: 48, width: 48 }}
          value={JSON.stringify(value)}
          // eslint-disable-next-line no-inline-styles/no-inline-styles
          style={{ width: 140, height: 140 }}
        />
        <div className="receive-address">
          <div className="address">{receiveAddress}</div>
          <Copy className="copy-icon" toCopy={receiveAddress}></Copy>
        </div>
      </div>
    </div>
  );
}
