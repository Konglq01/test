import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import QRCode from 'qrcode.react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export default function Receive() {
  const navigate = useNavigate();
  const { symbol, chainId } = useParams();
  const { currentNetwork } = useWalletInfo();
  const isMainChain = useMemo(() => chainId?.toLowerCase() === 'aelf', [chainId]);
  const isTestNet = useMemo(() => currentNetwork === 'TESTNET', [currentNetwork]);

  const receiveAddress = useMemo(() => {
    const _address = `ELF_U97UqZe52baDgmvdhgt6hcQnWBjiEKayeywLXiFEuH5LAEFhB_${chainId}`;
    // const address = addressFormat(_address, currentChain.chainId, currentChain.chainType);
    return _address;
  }, [chainId]);

  const rightElement = useMemo(() => {
    return (
      <div>
        <CustomSvg onClick={() => navigate(-1)} type="Close2" style={{ width: 18, height: 18, cursor: 'pointer' }} />
      </div>
    );
  }, [navigate]);

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
          <p className="network">{`${isMainChain ? 'MainChain' : 'SideChain'} ${chainId} ${
            isTestNet ? 'Testnet' : ''
          }`}</p>
        </div>
        <QRCode
          // imageSettings={}
          value={JSON.stringify({ address: receiveAddress, token: { symbol, chainId }, network: currentNetwork })}
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
