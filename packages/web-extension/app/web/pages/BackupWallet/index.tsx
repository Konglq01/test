import { setBackup } from '@portkey-wallet/store/wallet/actions';
import { message } from 'antd';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-use';
import { useAppDispatch, useAppSelector } from 'store/Provider/hooks';
import { SuccessPageType } from 'types/UI';
import { completeRegistration } from 'utils/lib/serviceWorkerAction';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import LockPage from '../components/LockPage';
import PortKeyTitle from '../components/PortKeyTitle';
import ConfirmMnemonic from './components/ConfirmMnemonic';
import Mnemonic from './components/Mnemonic';
import './index.less';

enum BackUpStep {
  view = 'view',
  confirm = 'confirm',
  unLock = 'unLock',
}

export default function BackupWallet() {
  const [step, setStep] = useState<BackUpStep>();
  const navigate = useNavigate();
  const location = useLocation();
  const { walletInfo } = useAppSelector((state) => state.wallet);
  const { passwordSeed } = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();

  const [userPrivacy, setUserPrivacy] = useState<{
    privateKey: string;
    mnemonic: string;
  }>();

  const getMnemonic = useCallback(async () => {
    const { data } = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
    const { privateKey: passwordSeed } = data ?? {};
    if (!walletInfo) return message.error('User information not obtained');
    if (!passwordSeed) return setStep(BackUpStep.unLock);

    getPrivateKeyAndMnemonic(
      {
        AESEncryptPrivateKey: walletInfo?.AESEncryptPrivateKey,
        AESEncryptMnemonic: walletInfo.AESEncryptMnemonic,
      },
      passwordSeed,
    )
      .then((res) => {
        setUserPrivacy(res);
        setStep(BackUpStep.view);
      })
      .catch(() => {
        message.error('User information not obtained');
      });
  }, [walletInfo]);

  useEffect(() => {
    console.log(location.state?.usr, 'location.state');
    if (location.state?.usr !== 'successPage') return setStep(BackUpStep.unLock);
    getMnemonic();
  }, [getMnemonic, location, walletInfo]);

  // does not need
  // const rightElement = useMemo(() => {
  //   if (BackUpStep.view === step) return 'Step 3/5';
  //   if (BackUpStep.confirm === step) return 'Step 4/5';
  //   return 'Step 5/5';
  // }, [step]);
  return (
    <div className="common-page backup-wallet">
      <PortKeyTitle leftElement leftCallBack={step !== BackUpStep.view ? () => setStep(BackUpStep.view) : undefined} />
      <div>
        {step === BackUpStep.unLock && (
          <div className="fix-max-content backup-unlock-wrapper">
            <LockPage
              onUnLockHandler={() => {
                navigate('/success-page/Creating');
                // getMnemonic();
              }}
            />
          </div>
        )}
        {step === BackUpStep.view && userPrivacy?.mnemonic && (
          <Mnemonic
            mnemonic={userPrivacy?.mnemonic}
            onNext={() => {
              setStep(BackUpStep.confirm);
            }}
          />
        )}
        {step === BackUpStep.confirm && userPrivacy?.mnemonic && (
          <ConfirmMnemonic
            mnemonic={userPrivacy?.mnemonic}
            onConfirm={() => {
              passwordSeed && dispatch(setBackup({ password: passwordSeed, isBackup: true }));
              completeRegistration();
              navigate(`/success-page/${SuccessPageType.Created}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
