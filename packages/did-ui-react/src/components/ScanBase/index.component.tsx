import { WalletInfoType } from '@portkey/types/wallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AElf from 'aelf-sdk';
import { useEffectOnce } from 'react-use';
import { LoginQRData } from '@portkey/types/types-ca/qrcode';
import { useIntervalQueryCAInfoByAddress } from '../../hooks/graphql';
import { ReactNode } from 'react';
import { NetworkItem } from '@portkey/types/types-ca/network';
import { handlePrivateKey } from '@portkey/store/wallet/utils';
import { isPrivateKey } from '@portkey/utils';
import { getAccountByPrivateKey } from '@portkey/utils/wallet';
import ScanCard from './components/ScanCard';
import SetPin from './components/SetPin';
import { WalletError } from '@portkey/store/wallet/type';
import { DIDWalletInfo } from '../types';
import { OnErrorFunc } from '../../types/error';
import { errorTip } from '../../utils/errorHandler';
import { DEVICE_TYPE } from '../../constants/common';
import './index.less';

export interface ScanBaseProps {
  chainId?: string;
  backIcon?: ReactNode;
  privateKey?: string;
  currentNetwork?: NetworkItem;
  isErrorTip?: boolean;
  onError?: OnErrorFunc;
  onBack?: () => void;
  onFinish?: (walletInfo: DIDWalletInfo) => void;
  onFinishFailed?: (errorInfo: any) => void;
}

enum ScanStep {
  Scan = 'Scan',
  SetPin = 'SetPin',
}

export default function ScanBase({
  chainId = 'AELF',
  backIcon,
  isErrorTip,
  privateKey,
  currentNetwork,
  onError,
  onBack,
  onFinish,
  onFinishFailed,
}: ScanBaseProps) {
  const [step, setStep] = useState<ScanStep>(ScanStep.Scan);
  const [newWallet, setNewWallet] = useState<WalletInfoType>();

  const caWallet = useIntervalQueryCAInfoByAddress({
    uri: currentNetwork?.graphqlUrl,
    address: newWallet?.address,
    chainId,
  });
  console.log(caWallet, 'caWallet====');

  const generateKeystore = useCallback(() => {
    try {
      let wallet;
      if (privateKey) {
        const key = handlePrivateKey(privateKey);
        if (!isPrivateKey(key)) throw 'Invalid Private Key';
        wallet = getAccountByPrivateKey(key);
      } else {
        wallet = AElf.wallet.createNewWallet();
      }

      setNewWallet(wallet);
    } catch (error: any) {
      console.error(error, 'ScanBase===');

      return errorTip(
        {
          errorFields: 'ScanBase',
          error,
        },
        isErrorTip,
        onError,
      );
    }
  }, [isErrorTip, onError, privateKey]);

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
    if (!currentNetwork) return '';
    const data: LoginQRData = {
      type: 'login',
      address: newWallet.address,
      netWorkType: currentNetwork.networkType,
      chainType: currentNetwork.walletType,
      deviceType: DEVICE_TYPE,
    };
    return JSON.stringify(data);
  }, [currentNetwork, newWallet]);

  useEffect(() => {
    if (caWallet) setStep(ScanStep.SetPin);
  }, [caWallet]);

  console.log(qrData, newWallet, 'qrData===caWallet');

  const onFinishHandler = useCallback(
    (pin: string) => {
      if (!newWallet) throw WalletError.noCreateWallet;
      if (!caWallet) throw WalletError.noCreateWallet;
      onFinish?.({
        pin,
        walletInfo: newWallet,
        caInfo: caWallet,
      });
    },
    [caWallet, newWallet, onFinish],
  );

  return (
    <div className="scan-base-wrapper">
      {step === ScanStep.Scan && <ScanCard backIcon={backIcon} onBack={onBack} qrData={qrData} />}
      {step === ScanStep.SetPin && (
        <SetPin onFinish={onFinishHandler} onFinishFailed={onFinishFailed} onCancel={() => setStep(ScanStep.Scan)} />
      )}
    </div>
  );
}
