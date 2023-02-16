import { handlePrivateKey, isWalletError } from '@portkey/store/wallet/utils';
import { LoginType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { isPrivateKey, randomId } from '@portkey/utils';
import { formatWalletInfo, getAccountByPrivateKey } from '@portkey/utils/wallet';
import { useState, useCallback } from 'react';
import { setLoading } from '../../utils/loading';
import SetPinBase from '../SetPinBase/index.component';
import AElf from 'aelf-sdk';
import { WalletInfoType } from '@portkey/types/wallet';
import { useEffectOnce } from 'react-use';
import { VerificationType } from '@portkey/types/verifier';
import clsx from 'clsx';
import { recoveryDIDWallet, registerDIDWallet } from '@portkey/api/api-did/utils/wallet';
import { GuardiansApprovedType } from '@portkey/types/guardian';
import { DIDWalletInfo } from '../types';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import useFetchDidWalletInfo from '../../hooks/useFetchDidWalletInfo';
import { OnErrorFunc } from '../../types/error';
import { errorTip } from '../../utils/errorHandler';

export interface SetPinAndAddManagerProps {
  serviceUrl: string;
  className?: string;
  loginType?: LoginType;
  privateKey?: string;
  chainId?: string;
  guardianAccount: string;
  verificationType: VerificationType;
  walletName?: string;
  guardianApprovedList: GuardiansApprovedType[];
  isErrorTip?: boolean;
  onError?: OnErrorFunc;
  onAddManager?: (result: { managerInfo: ManagerInfo; pin: string; walletInfo: WalletInfoType }) => void;
  onFinish?: (values: DIDWalletInfo) => void;
}

export default function SetPinAndAddManager({
  serviceUrl,
  chainId = 'AELF',
  className,
  loginType = LoginType.email,
  privateKey,
  walletName = 'walletName',
  guardianAccount,
  verificationType,
  guardianApprovedList,
  isErrorTip,
  onError,
  onFinish,
  onAddManager,
}: SetPinAndAddManagerProps) {
  const [newWallet, setNewWallet] = useState<WalletInfoType>();
  const getWalletCAAddressResult = useFetchDidWalletInfo();

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
      console.error(error);
      return errorTip(
        {
          errorFields: 'SetPinAndAddManager',
          error: error,
        },
        isErrorTip,
        onError,
      );
    }
  }, [isErrorTip, onError, privateKey]);

  useEffectOnce(() => {
    generateKeystore();
  });

  const requestRegisterDIDWallet = useCallback(
    async ({ managerAddress }: { managerAddress: string }) => {
      if (!guardianAccount || !LoginStrType[loginType]) throw 'Missing account!!! Please login/register again';
      // const baseUrl
      if (!guardianApprovedList?.length) throw 'Missing guardianApproved';
      const requestId = randomId();
      const registerVerifier = guardianApprovedList[0];
      const result = await registerDIDWallet({
        baseUrl: serviceUrl,
        type: LoginStrType[loginType],
        loginGuardianAccount: guardianAccount,
        managerAddress,
        deviceString: Date.now().toString(), //navigator.userAgent,
        chainId,
        verifierId: registerVerifier.verifierId,
        verificationDoc: registerVerifier.verificationDoc,
        signature: registerVerifier.signature,
        context: {
          clientId: managerAddress,
          requestId,
        },
      });
      return {
        requestId,
        sessionId: result.sessionId,
      };
    },
    [chainId, guardianAccount, guardianApprovedList, loginType, serviceUrl],
  );

  const requestRecoveryDIDWallet = useCallback(
    async ({ managerAddress }: { managerAddress: string }) => {
      if (!guardianAccount || !LoginStrType[loginType]) throw 'Missing account!!! Please login/register again';
      const requestId = randomId();
      const result = await recoveryDIDWallet({
        baseURL: serviceUrl,
        loginGuardianAccount: guardianAccount,
        managerAddress,
        deviceString: Date.now().toString(), //navigator.userAgent,
        chainId,
        guardiansApproved: guardianApprovedList,
        context: {
          clientId: managerAddress,
          requestId,
        },
      });

      return {
        requestId,
        sessionId: result.sessionId,
      };
    },
    [guardianAccount, loginType, serviceUrl, chainId, guardianApprovedList],
  );

  const onCreate = useCallback(
    async (values: any) => {
      try {
        const { pin } = values;
        if (!guardianAccount) throw 'Missing account!!!';
        if (!newWallet?.address) throw 'No walletInfo';
        const formatWallet = formatWalletInfo(newWallet, pin, walletName);
        if (!formatWallet) throw 'Create managerInfo error';
        const { walletInfo } = formatWallet;
        setLoading(true);

        // Step 9
        let sessionInfo = {
          requestId: walletInfo.address,
          sessionId: '',
        };

        if (verificationType === VerificationType.register) {
          sessionInfo = await requestRegisterDIDWallet({ managerAddress: walletInfo.address });
        } else if (verificationType === VerificationType.communityRecovery) {
          sessionInfo = await requestRecoveryDIDWallet({ managerAddress: walletInfo.address });
        } else {
          throw 'VerificationType error';
        }

        const managerInfo = {
          managerUniqueId: sessionInfo.sessionId,
          clientId: walletInfo.address,
          requestId: sessionInfo.requestId,
          loginAccount: guardianAccount,
          type: loginType,
          verificationType,
        };

        onAddManager?.({
          managerInfo,
          pin,
          walletInfo,
        });

        // // TODO Get  caAddress

        const walletResult = await getWalletCAAddressResult({
          baseURL: serviceUrl,
          verificationType,
          sessionId: sessionInfo.sessionId,
          managerAddress: walletInfo.address,
        });

        onFinish?.({
          caInfo: {
            managerInfo,
            [chainId]: {
              caAddress: walletResult.caAddress,
              caHash: walletResult.caHash,
            },
          },
          pin,
          walletInfo,
        });
      } catch (error: any) {
        setLoading(false);
        console.log(error, 'onCreate==error');
        let _error;

        const walletError = isWalletError(error);
        if (walletError) {
          _error = walletError;
        } else if (error?.message || error?.error?.message) {
          _error = error?.message || error?.error?.message;
        } else {
          _error = typeof error === 'string' ? error : 'Something error';
        }

        return errorTip(
          {
            errorFields: 'SetPinAndAddManager',
            error: _error,
          },
          isErrorTip,
          onError,
        );
      }
      setLoading(false);
    },
    [
      guardianAccount,
      newWallet,
      walletName,
      verificationType,
      loginType,
      onAddManager,
      getWalletCAAddressResult,
      serviceUrl,
      onFinish,
      chainId,
      requestRegisterDIDWallet,
      requestRecoveryDIDWallet,
      isErrorTip,
      onError,
    ],
  );

  return (
    <SetPinBase
      className={clsx('portkey-card-height', className)}
      onFinish={onCreate}
      onFinishFailed={(err) =>
        errorTip(
          {
            errorFields: 'SetPinAndAddManager',
            error: `Form Error: ${err.errorFields[0].name}`,
          },
          isErrorTip,
          onError,
        )
      }
    />
  );
}
