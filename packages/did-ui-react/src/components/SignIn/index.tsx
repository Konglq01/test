/**
 * @file
 *
 * First you have to configure networkList using ConfigProvider.setGlobalConfig
 */

import BaseModal from './components/BaseModal';
import { useState, useCallback, useEffect, useMemo } from 'react';
import ConfigProvider, { BaseConfigProvider } from '../config-provider';
import Step1, { OnSignInFinishedFun } from './components/Step1';
import { ModalProps } from 'antd';
import { DIDWalletInfo } from '../types';
import Step2WithSignUp from './components/Step2WithSignUp';
import Step2WithSignIn from './components/Step2WithSignIn';
import { VerifierItem, VerificationType } from '@portkey/types/verifier';
import { IVerifyInfo } from '../types/verify';
import Step3 from './components/Step3';
import { GuardiansApprovedType } from '@portkey/types/guardian';
import { useEffectOnce, usePrevious } from 'react-use';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { ChainInfoType } from './types';
import useChainInfo from '../../hooks/useChainInfo';
import { getVerifierList } from '../../utils/sandboxUtil/getVerifierList';
import { OnErrorFunc } from '../../types/error';
import './index.less';
import { globalState } from './store';

type SIGN_IN_STEP = 'SignIn' | 'Step2WithSignUp' | 'Step2WithSignIn' | 'Step3';

export interface SignInProps {
  //
  chainId?: string;
  chainInfo?: ChainInfoType;
  loginType?: LoginType;

  sandboxId?: string;
  isErrorTip?: boolean;

  // Login
  inputValidator?: (value?: string) => Promise<any>;
  onNetworkChange?: (network: string) => void;

  onFinish?: (didWallet: DIDWalletInfo) => void;

  // Modal config
  open?: boolean;
  className?: string;
  getContainer?: ModalProps['getContainer'];
  onCancel?: () => void;
  onError?: OnErrorFunc;
}

type TSignUpVerifier = { verifier: VerifierItem } & IVerifyInfo;

export default function SignIn({
  chainId = 'AELF',
  chainInfo,
  loginType = LoginType.email,
  isErrorTip = true,
  sandboxId,

  inputValidator,
  open,
  className,
  getContainer,
  onNetworkChange,
  onCancel,
  onFinish,
  onError,
}: SignInProps) {
  const [_step, setStep] = useState<SIGN_IN_STEP>('SignIn');
  const [guardianAccount, setGuardianAccount] = useState<string>();

  const _networkList = useMemo(() => ConfigProvider.config?.network?.networkList, []);

  const _defaultNetwork = useMemo(
    () => ConfigProvider.config?.network?.defaultNetwork || _networkList?.[0]?.networkType,
    [_networkList],
  );
  const [_network, setNetwork] = useState<string | undefined>(_defaultNetwork);

  const networkItem = useMemo(
    () => _networkList?.find((network) => network.networkType === _network),
    [_network, _networkList],
  );

  const _chainInfo = useChainInfo({ baseUrl: networkItem?.apiUrl, chainInfo, chainId }, onError);

  const serviceUrl = useMemo(() => networkItem?.apiUrl || '', [networkItem?.apiUrl]);

  const preStep = usePrevious(_step);

  const [approvedList, setApprovedList] = useState<GuardiansApprovedType[]>();

  const onSignInFinished: OnSignInFinishedFun = useCallback(
    (result) => {
      const { type, value } = result.result;
      if (result.isFinished) {
        // Sign in by scan
        onFinish?.(value as DIDWalletInfo);
      } else {
        if (type === 'SignUp') {
          setStep('Step2WithSignUp');
        } else {
          setStep('Step2WithSignIn');
        }
        setGuardianAccount(value as string);
      }
    },
    [onFinish],
  );

  const onStep2WithSignUpFinish = useCallback(
    (res: TSignUpVerifier) => {
      if (!guardianAccount) return console.error('No guardianAccount!');
      const list = [
        {
          type: LoginStrType[loginType],
          value: guardianAccount,
          verifierId: res.verifier.id,
          verificationDoc: res.verificationDoc,
          signature: res.signature,
        },
      ];
      setApprovedList(list);
      setStep('Step3');
    },
    [guardianAccount, loginType],
  );

  const onStep2Cancel = useCallback(() => {
    setStep('SignIn');
    setApprovedList(undefined);
  }, []);

  const onStep3Cancel = useCallback(() => {
    if (preStep === 'Step2WithSignUp') {
      setStep('Step2WithSignUp');
      setApprovedList(undefined);
    } else if (preStep === 'Step2WithSignIn') {
      setStep('Step2WithSignIn');
    }
  }, [preStep]);

  useEffectOnce(() => {
    _defaultNetwork && globalState.setState('network', _defaultNetwork);
  });

  const _onNetworkChange = useCallback(
    (network: string) => {
      ConfigProvider.setGlobalConfig({ network: { defaultNetwork: network } });
      setNetwork(network);
      globalState.setState('network', network);
      onNetworkChange?.(network);
    },
    [onNetworkChange],
  );

  console.log(_chainInfo, '_chainInfo===');

  const [verifierList, setVerifierList] = useState<VerifierItem[]>();

  const getVerifierListHandler = useCallback(async () => {
    try {
      if (!_chainInfo) return;

      const list = await getVerifierList({
        sandboxId,
        rpcUrl: _chainInfo.endPoint,
        chainType: networkItem?.walletType ?? 'aelf',
        address: _chainInfo.contractAddress,
      });
      setVerifierList(list);
    } catch (error) {
      onError?.({
        errorFields: 'VerifierList',
        error: error,
      });
    }
  }, [_chainInfo, networkItem?.walletType, onError, sandboxId]);

  useEffect(() => {
    getVerifierListHandler();
  }, [getVerifierListHandler]);

  return (
    <BaseConfigProvider>
      <BaseModal className={className} open={open} getContainer={getContainer} onCancel={onCancel}>
        {_step === 'SignIn' && (
          <Step1
            sandboxId={sandboxId}
            chainInfo={_chainInfo}
            defaultNetwork={_defaultNetwork}
            networkList={_networkList}
            isErrorTip={isErrorTip}
            onError={onError}
            inputValidator={inputValidator}
            onSignInFinished={onSignInFinished}
            onNetworkChange={_onNetworkChange}
          />
        )}

        {_step === 'Step2WithSignUp' && (
          <Step2WithSignUp
            loginType={loginType}
            guardianAccount={guardianAccount || ''}
            serviceUrl={serviceUrl}
            verifierList={verifierList}
            isErrorTip={isErrorTip}
            onError={onError}
            onFinish={onStep2WithSignUpFinish}
            onCancel={onStep2Cancel}
          />
        )}
        {_step === 'Step2WithSignIn' && (
          <Step2WithSignIn
            sandboxId={sandboxId}
            approvedList={approvedList}
            loginType={loginType}
            serviceUrl={serviceUrl}
            chainInfo={_chainInfo}
            verifierList={verifierList}
            chainType={networkItem?.walletType}
            guardianAccount={guardianAccount || ''}
            isErrorTip={isErrorTip}
            onError={onError}
            onFinish={(list) => {
              setApprovedList(list);
              setStep('Step3');
            }}
            onCancel={onStep2Cancel}
          />
        )}

        {_step === 'Step3' && (
          <Step3
            serviceUrl={serviceUrl}
            chainId={_chainInfo?.chainId}
            loginType={loginType}
            guardianAccount={guardianAccount || ''}
            verificationType={
              preStep === 'Step2WithSignUp' ? VerificationType.register : VerificationType.communityRecovery
            }
            guardianApprovedList={approvedList || []}
            onFinish={onFinish}
            onCancel={onStep3Cancel}
          />
        )}
      </BaseModal>
    </BaseConfigProvider>
  );
}
