import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey/types';
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
  const isMainChain = useMemo(() => chainId === 'AELF', [chainId]);
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'Testnet' : ''), [currentNetwork]);
  const { state } = useLocation();
  const caAddress = useMemo(() => `ELF_${wallet?.[chainId || 'AELF'].caAddress}_${chainId}`, [chainId, wallet]);
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
        chainId: chainId as ChainId,
        balance: state.balance as string,
        imageUrl: state.imageUrl as string,
        tokenContractAddress: state.address,
        balanceInUsd: state.balanceInUsd,
        decimals: state.decimals,
      },
      address: caAddress,
    }),
    [caAddress, chainId, currentNetwork, state],
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
          {symbol === 'ELF' ? <CustomSvg type="Aelf" /> : <div className="icon">{symbol?.[0]}</div>}
          <p className="symbol">{symbol}</p>
          <p className="network">{`${isMainChain ? 'MainChain' : 'SideChain'} ${chainId} ${isTestNet}`}</p>
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
