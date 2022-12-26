import { useCallback, useState } from 'react';
import type { OnCreateCallback } from '../components/CreateWalletForm';
import PortKeyTitle from '../components/PortKeyTitle';
import ImportMnemonic from './components/ImportMnemonic';
import LoadSuccess from './components/ImportSuccess';
import { message } from 'antd';
import CreateSuccess from './components/CreateSuccess';
import CreateWalletPage from '../components/CreateWalletPage';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { useAppDispatch } from 'store/Provider/hooks';
import { createWallet, setBackup } from '@portkey/store/wallet/actions';
import { setPasswordSeed } from 'store/reducers/user/slice';
import './index.less';
import { completeRegistration } from 'utils/lib/serviceWorkerAction';

export enum ImportStep {
  ImportMnemonic = 'Mnemonic',
  loadSuccess = 'loadSuccess',
  createWallet = 'createWallet',
  createSuccess = 'createSuccess',
}

export default function LoadWallet() {
  const [step, setStep] = useState<ImportStep>(ImportStep.ImportMnemonic);
  const [wallet, setWallet] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const loadConfirm = useCallback((walletInfo: any) => {
    setWallet(walletInfo);
    setStep(ImportStep.loadSuccess);
  }, []);

  const onCreate: OnCreateCallback = useCallback(
    (values) => {
      if (!wallet) return message.error('No walletInfo');
      const { password, walletName } = values;
      setLoading(true);
      try {
        dispatch(createWallet({ walletInfo: wallet, walletName, password }));
        dispatch(setBackup({ password, isBackup: true }));
        setStep(ImportStep.createSuccess);
        InternalMessage.payload(InternalMessageTypes.SET_SEED, password).send();
        dispatch(setPasswordSeed(password));
        completeRegistration();
        setLoading(false);
      } catch (error) {
        message.error('something error');
      }
      setLoading(false);
    },
    [dispatch, wallet],
  );

  // does not need
  // const rightElement = useMemo(() => {
  //   if (step === ImportStep.ImportMnemonic) return 'Step 1/4';
  //   if (step === ImportStep.loadSuccess) return 'Step 2/4';
  //   if (step === ImportStep.createWallet) return 'Step 3/4';
  //   if (step === ImportStep.createSuccess) return 'Step 4/4';
  // }, [step]);

  return (
    <div className="common-page load-wallet">
      {![ImportStep.loadSuccess, ImportStep.createSuccess].includes(step) && <PortKeyTitle />}

      <div>
        {step === ImportStep.ImportMnemonic && <ImportMnemonic onConfirm={loadConfirm} />}
        {step === ImportStep.loadSuccess && <LoadSuccess onNext={() => setStep(ImportStep.createWallet)} />}
        {step === ImportStep.createWallet && <CreateWalletPage loading={loading} onCreate={onCreate} />}
        {step === ImportStep.createSuccess && <CreateSuccess />}
      </div>
    </div>
  );
}
