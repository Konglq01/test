import { WalletInfoType } from '@portkey/types/wallet';
import CustomSvg from 'components/CustomSvg';
import QRCode from 'qrcode.react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import AElf from 'aelf-sdk';
import { useEffectOnce } from 'react-use';
import { LoginQRData } from '@portkey/types/types-ca/qrcode';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { useCurrentWalletInfoByScan } from '@portkey/hooks/hooks-ca/useCurrentWalletInfoByScan';
import './index.less';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';

export default function ScanCard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const [newWallet, setNewWallet] = useState<WalletInfoType>();
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const getWalletInfo = useCurrentWalletInfoByScan();

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
    };
    return JSON.stringify(data);
  }, [currentNetwork, newWallet]);

  useEffect(() => {
    if (!newWallet) return;
    getWalletInfo(newWallet.address).then((loginInfo) => {
      console.log(loginInfo, 'getWalletInfo');
      // dispatch(
      //   setLoginAccountAction({
      //     // loginGuardianType: loginInfo.loginGuardianType,
      //     // accountLoginType: LoginType.email,
      //     createType: 'login',
      //   }),
      // );
    });
  }, [newWallet, dispatch, getWalletInfo, setLoading]);

  return (
    <div className="login-card scan-card-wrapper">
      <h2 className="title">
        Scan code to log in
        <CustomSvg type="PC" onClick={() => navigate('/register/start')} />
      </h2>
      <p>Please use the portkey Dapp to scan the QR code</p>
      <div className="login-content">
        {qrData && <QRCode className="qrc" value={qrData} style={{ width: 170, height: 170 }} />}
      </div>
    </div>
  );
}
