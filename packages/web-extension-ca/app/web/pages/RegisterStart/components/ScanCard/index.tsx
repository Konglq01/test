import { WalletInfoType } from '@portkey-wallet/types/wallet';
import CustomSvg from 'components/CustomSvg';
import QRCode from 'qrcode.react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import AElf from 'aelf-sdk';
import { useEffectOnce } from 'react-use';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAppDispatch } from 'store/Provider/hooks';
import { useIntervalQueryCAInfoByAddress } from '@portkey-wallet/hooks/hooks-ca/graphql';
import { setWalletInfoAction } from 'store/reducers/loginCache/actions';
import { getDeviceInfo } from 'utils/device';
import { DEVICE_TYPE } from 'constants/index';
import { DEVICE_INFO_VERSION } from '@portkey-wallet/constants/constants-ca/device';
import './index.less';

const QR_SIZE = 200;

export default function ScanCard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [newWallet, setNewWallet] = useState<WalletInfoType>();
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const deviceInfo = useMemo(() => getDeviceInfo(DEVICE_TYPE), []);
  const caWallet = useIntervalQueryCAInfoByAddress(currentNetwork, newWallet?.address);
  const generateKeystore = useCallback(() => {
    try {
      const wallet = walletInfo?.address ? walletInfo : AElf.wallet.createNewWallet();
      setNewWallet(wallet);
    } catch (error) {
      console.error(error);
    }
  }, [walletInfo]);

  useEffectOnce(() => {
    const timer = setTimeout(() => {
      generateKeystore();
    }, 10);
    return () => {
      timer && clearTimeout(timer);
    };
  });

  const qrData = useMemo(() => {
    if (!newWallet) return '';
    const data: LoginQRData = {
      type: 'login',
      address: newWallet.address,
      netWorkType: currentNetwork,
      chainType: 'aelf',
      extraData: {
        deviceInfo,
        version: DEVICE_INFO_VERSION,
      },
    };
    return JSON.stringify(data);
  }, [currentNetwork, deviceInfo, newWallet]);

  useEffect(() => {
    if (caWallet) {
      // caWallet
      dispatch(
        setWalletInfoAction({
          walletInfo: newWallet,
          caWalletInfo: caWallet,
        }),
      );
      navigate('/login/set-pin/scan');
    }
  }, [caWallet, dispatch, navigate, newWallet]);

  return (
    <div className="register-start-card scan-card-wrapper">
      <h2 className="title">
        Scan code to log in
        <CustomSvg type="PC" onClick={() => navigate('/register/start')} />
      </h2>
      <p>Please use the portkey Dapp to scan the QR code</p>
      <div className="login-content">
        {qrData && <QRCode className="qrc" value={qrData} style={{ width: QR_SIZE, height: QR_SIZE }} />}
      </div>
    </div>
  );
}
