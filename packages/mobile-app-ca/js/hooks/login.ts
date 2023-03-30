import { CurrentWalletType, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  createWallet,
  setCAInfo,
  setManagerInfo,
  setOriginChainId,
} from '@portkey-wallet/store/store-ca/wallet/actions';
import { CAInfo, LoginType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { AuthenticationInfo, VerificationType, VerifierInfo } from '@portkey-wallet/types/verifier';
import { handleErrorCode, sleep } from '@portkey-wallet/utils';
import Loading from 'components/Loading';
import AElf from 'aelf-sdk';
import { request } from 'api';
import { useCallback, useRef } from 'react';
import { useAppDispatch } from 'store/hooks';
import useBiometricsReady from './useBiometrics';
import navigationService from 'utils/navigationService';
import { onResultFail, TimerResult, IntervalGetResultParams, intervalGetResult } from 'utils/wallet';
import CommonToast from 'components/CommonToast';
import useEffectOnce from './useEffectOnce';
import { setCredentials } from 'store/user/actions';
import { DigitInputInterface } from 'components/DigitInput';
import { GuardiansApproved } from 'pages/Guardian/types';
import { useGetDeviceInfo } from './device';
import { extraDataEncode } from '@portkey-wallet/utils/device';
import { useGetGuardiansInfo, useGetVerifierServers } from './guardian';
import { handleUserGuardiansList } from '@portkey-wallet/utils/guardian';
import { useLanguage } from 'i18n/hooks';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useGetRegisterInfo } from '@portkey-wallet/hooks/hooks-ca/guardian';

export function useOnManagerAddressAndQueryResult() {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const biometricsReady = useBiometricsReady();
  const getDeviceInfo = useGetDeviceInfo();
  const timer = useRef<TimerResult>();
  useEffectOnce(() => {
    return () => {
      timer.current?.remove();
    };
  });
  const originChainId = useOriginChainId();
  const onIntervalGetResult = useIntervalGetResult();
  return useCallback(
    async ({
      managerInfo,
      walletInfo,
      confirmPin,
      pinRef,
      verifierInfo,
      guardiansApproved,
    }: {
      managerInfo: ManagerInfo;
      walletInfo?: CurrentWalletType;
      confirmPin: string;
      pinRef?: React.MutableRefObject<DigitInputInterface | undefined>;
      verifierInfo?: VerifierInfo;
      guardiansApproved?: GuardiansApproved;
    }) => {
      Loading.show({ text: t('Creating address on the chain...') });
      await sleep(1000);
      const isRecovery = managerInfo.verificationType === VerificationType.communityRecovery;
      try {
        const tmpWalletInfo = walletInfo?.address ? walletInfo : AElf.wallet.createNewWallet();
        let data: any = {
          loginGuardianIdentifier: managerInfo.loginAccount,
          manager: tmpWalletInfo.address,
          extraData: extraDataEncode(getDeviceInfo()),
          context: {
            clientId: tmpWalletInfo.address,
            requestId: tmpWalletInfo.address,
          },
          chainId: originChainId,
        };

        let fetch = request.verify.registerRequest;
        if (isRecovery) {
          fetch = request.verify.recoveryRequest;
          data.guardiansApproved = guardiansApproved?.map(i => ({ identifier: i.value, ...i }));
        } else {
          data = {
            ...managerInfo,
            ...verifierInfo,
            type: LoginType[managerInfo.type],
            ...data,
          };
        }
        console.log(data, '====data');

        const req = await fetch({
          data,
        });
        // whether there is wallet information
        const _managerInfo = {
          ...managerInfo,
          managerUniqueId: req.sessionId,
          requestId: tmpWalletInfo.address,
        } as ManagerInfo;

        if (walletInfo?.address) {
          dispatch(setManagerInfo({ managerInfo: _managerInfo, pin: confirmPin }));
        } else {
          dispatch(
            createWallet({
              walletInfo: tmpWalletInfo,
              caInfo: { managerInfo: _managerInfo },
              pin: confirmPin,
            }),
          );
        }
        dispatch(setCredentials({ pin: confirmPin }));

        if (biometricsReady) {
          Loading.hide();
          navigationService.navigate('SetBiometrics', { pin: confirmPin });
        } else {
          timer.current = onIntervalGetResult({
            managerInfo: _managerInfo,
            onPass: (caInfo: CAInfo) => {
              if (isRecovery) CommonToast.success('Wallet Recovered Successfully!');
              Loading.hide();
              dispatch(
                setCAInfo({
                  caInfo,
                  pin: confirmPin,
                  chainId: originChainId,
                }),
              );
              navigationService.reset('Tab');
            },
            onFail: (message: string) => onResultFail(dispatch, message, isRecovery, true),
          });
        }
      } catch (error) {
        Loading.hide();
        CommonToast.failError(error);
        pinRef?.current?.reset();
      }
    },
    [biometricsReady, dispatch, getDeviceInfo, onIntervalGetResult, originChainId, t],
  );
}

export function useIntervalGetResult() {
  return useCallback((params: IntervalGetResultParams) => intervalGetResult(params), []);
}

type LoginParams = {
  loginAccount: string;
  loginType?: LoginType;
  authenticationInfo?: AuthenticationInfo;
  showLoginAccount?: string;
};

export function useOnLogin() {
  const dispatch = useAppDispatch();
  const getVerifierServers = useGetVerifierServers();
  const getGuardiansInfo = useGetGuardiansInfo();
  const getRegisterInfo = useGetRegisterInfo();
  const getChainInfo = useGetChainInfo();
  return useCallback(
    async (params: LoginParams) => {
      const { loginAccount, loginType = LoginType.Email, authenticationInfo, showLoginAccount } = params;
      try {
        const { originChainId } = await getRegisterInfo({
          loginGuardianIdentifier: loginAccount,
        });
        const chainInfo = await getChainInfo(originChainId);
        const verifierServers = await getVerifierServers(chainInfo);
        const holderInfo = await getGuardiansInfo({ guardianIdentifier: loginAccount }, chainInfo);
        if (holderInfo?.guardianAccounts || holderInfo?.guardianList) {
          // login
          dispatch(setOriginChainId(originChainId));
          navigationService.navigate('GuardianApproval', {
            loginAccount,
            userGuardiansList: handleUserGuardiansList(holderInfo, verifierServers),
            authenticationInfo,
          });
        } else {
          dispatch(setOriginChainId(DefaultChainId));
          navigationService.navigate('SelectVerifier', {
            showLoginAccount: showLoginAccount || loginAccount,
            loginAccount,
            loginType,
            authenticationInfo,
          });
        }
      } catch (error) {
        if (handleErrorCode(error) === '3002') {
          dispatch(setOriginChainId(DefaultChainId));
          navigationService.navigate('SelectVerifier', {
            showLoginAccount: showLoginAccount || loginAccount,
            loginAccount,
            loginType,
            authenticationInfo,
          });
        } else {
          throw error;
        }
      }
    },
    [dispatch, getChainInfo, getGuardiansInfo, getRegisterInfo, getVerifierServers],
  );
}
