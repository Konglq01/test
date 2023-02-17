import LoginCard from '../LoginBase/index.component';
import ScanCard from '../ScanBase/index.component';
import SignUpBase from '../SignUpBase/index.component';
import { useCallback } from 'react';
import { useState, useMemo } from 'react';
import type { CreateWalletType, DIDWalletInfo } from '../types';
import { NetworkItem } from '@portkey/types/types-ca/network';
import ConfigProvider from '../config-provider';
import CustomSvg from '../CustomSvg';
import clsx from 'clsx';
import { useUpdateEffect } from 'react-use';
import { getHolderInfo } from '../../utils/sandboxUtil/getHolderInfo';
import { ChainInfoType } from '../SignIn/types';
import PortkeyUIError from '../../constants/error';
import { contractErrorHandler } from '../../utils/errorHandler';
import { EmailError } from '@portkey/utils/check';
import { OnErrorFunc } from '../../types/error';
import './index.less';

export interface SignUpAndLoginProps {
  type?: CreateWalletType;
  chainInfo?: ChainInfoType;
  sandboxId?: string;
  privateKey?: string;
  networkList?: NetworkItem[];
  defaultNetwork?: string;
  className?: string;
  isErrorTip?: boolean;
  onError?: OnErrorFunc;
  inputValidator?: (value?: string) => Promise<any>;
  onSignTypeChange?: (type: CreateWalletType) => void;
  onSuccess?: (value: string) => void;
  onFinish?: (walletInfo: DIDWalletInfo) => void;
  onNetworkChange?: (network: string) => void;
}

export default function SignUpAndLoginBaseCom({
  type,
  sandboxId,
  className,
  chainInfo,
  privateKey,
  networkList,
  defaultNetwork,
  isErrorTip,
  onError,
  onSuccess,
  onFinish,
  inputValidator,
  onSignTypeChange,
  onNetworkChange,
}: SignUpAndLoginProps) {
  const [_type, setType] = useState<CreateWalletType>(type ?? 'Login');

  const _networkList = useMemo(() => networkList || ConfigProvider.config?.network?.networkList, [networkList]);

  const _defaultNetwork = useMemo(
    () => defaultNetwork || ConfigProvider.config?.network?.defaultNetwork || _networkList?.[0]?.networkType,
    [_networkList, defaultNetwork],
  );
  const [network, setNetwork] = useState<string | undefined>(_defaultNetwork);

  const LoginCardOnStep = useCallback((step: Omit<CreateWalletType, 'Login'>) => setType(step as CreateWalletType), []);

  const networkChange = useCallback(
    (network: string) => {
      setNetwork(network);
      onNetworkChange?.(network);
    },
    [onNetworkChange],
  );

  const currentNetwork = useMemo(
    () => _networkList?.find((item) => item.networkType === network),
    [_networkList, network],
  );

  useUpdateEffect(() => {
    onSignTypeChange?.(_type);
  }, [_type, onSignTypeChange]);

  const _inputValidator = useCallback(
    async (value?: string): Promise<any> => {
      if (!chainInfo) throw PortkeyUIError.getContractError;

      let isHasAccount = false;

      try {
        const checkResult = await getHolderInfo({
          sandboxId,
          rpcUrl: chainInfo.endPoint,
          address: chainInfo.contractAddress,
          chainType: currentNetwork?.walletType || 'aelf',
          paramsOption: {
            loginGuardianAccount: value as string,
          },
        });
        console.log(checkResult, 'checkResult===GetHolderInfo');
        if (checkResult.guardiansInfo?.guardianAccounts?.length > 0) {
          isHasAccount = true;
        }
      } catch (error: any) {
        console.log(error, 'validateEmail===');
        if (error?.Error?.Details && error?.Error?.Details?.indexOf('Not found')) {
          isHasAccount = false;
        } else if (error?.Error?.Message === 'Invalid signature') {
          isHasAccount = false;
        } else {
          throw contractErrorHandler(error);
        }
      }

      if (_type === 'SignUp') {
        if (isHasAccount) throw EmailError.alreadyRegistered;
      } else {
        if (!isHasAccount) throw EmailError.noAccount;
      }

      return inputValidator?.(value);
    },
    [_type, chainInfo, currentNetwork?.walletType, inputValidator, sandboxId],
  );

  return (
    <div className={clsx('portkey-card-height signup-login-content', className)}>
      {_type === 'SignUp' && (
        <SignUpBase inputValidator={_inputValidator} onBack={() => setType('Login')} onSignUp={onSuccess} />
      )}
      {_type === 'LoginByScan' && (
        <ScanCard
          chainId={chainInfo?.chainId}
          privateKey={privateKey}
          backIcon={<CustomSvg type="PC" />}
          currentNetwork={currentNetwork}
          onBack={() => setType('Login')}
          onFinish={onFinish}
          isErrorTip={isErrorTip}
          onError={onError}
        />
      )}
      {_type === 'Login' && (
        <>
          <LoginCard
            network={network}
            inputValidator={_inputValidator}
            onStep={LoginCardOnStep}
            onLogin={onSuccess}
            onNetworkChange={networkChange}
          />
        </>
      )}
    </div>
  );
}
