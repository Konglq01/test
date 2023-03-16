import { CurrentWalletType } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  createWallet,
  getChainListAsync,
  setCAInfo,
  setManagerInfo,
} from '@portkey-wallet/store/store-ca/wallet/actions';
import { CAInfo, LoginType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType, VerifierInfo } from '@portkey-wallet/types/verifier';
import { handleErrorCode, sleep } from '@portkey-wallet/utils';
import Loading from 'components/Loading';
import AElf from 'aelf-sdk';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
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
import { DEVICE_TYPE } from 'constants/common';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useGetGuardiansInfo, useGetVerifierServers } from './guardian';
import { handleUserGuardiansList } from '@portkey-wallet/utils/guardian';

export function useOnManagerAddressAndQueryResult() {
  const dispatch = useAppDispatch();
  const biometricsReady = useBiometricsReady();
  const getDeviceInfo = useGetDeviceInfo();
  const timer = useRef<TimerResult>();
  useEffectOnce(() => {
    return () => {
      timer.current?.remove();
    };
  });
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
      Loading.show();
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
          chainId: DefaultChainId,
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
        console.log(data, JSON.stringify(data), managerInfo, '====data');
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
                  chainId: DefaultChainId,
                }),
              );
              navigationService.reset('Tab');
            },
            onFail: (message: string) => onResultFail(dispatch, message, isRecovery),
          });
        }
      } catch (error) {
        Loading.hide();
        CommonToast.failError(error);
        pinRef?.current?.reset();
      }
    },
    [biometricsReady, dispatch, getDeviceInfo, onIntervalGetResult],
  );
}

export function useIntervalGetResult() {
  return useCallback((params: IntervalGetResultParams) => intervalGetResult(params), []);
}

export function useOnLogin() {
  const chainInfo = useCurrentChain('AELF');
  const dispatch = useAppDispatch();
  const getVerifierServers = useGetVerifierServers();
  const getGuardiansInfo = useGetGuardiansInfo();
  return useCallback(
    async (loginAccount: string) => {
      try {
        let _chainInfo;
        if (!chainInfo) {
          const chainList = await dispatch(getChainListAsync());
          if (Array.isArray(chainList.payload)) _chainInfo = chainList.payload[1];
        }
        const verifierServers = await getVerifierServers(_chainInfo);
        const holderInfo = await getGuardiansInfo({ guardianIdentifier: loginAccount }, _chainInfo);
        if (holderInfo?.guardianAccounts || holderInfo?.guardianList) {
          // login
          navigationService.navigate('GuardianApproval', {
            loginAccount,
            userGuardiansList: handleUserGuardiansList(holderInfo, verifierServers),
          });
        } else {
          navigationService.navigate('SelectVerifier', { loginAccount, loginType: LoginType.Email });
        }
      } catch (error) {
        if (handleErrorCode(error) === '3002') {
          navigationService.navigate('SelectVerifier', { loginAccount, loginType: LoginType.Email });
        } else {
          throw error;
        }
      }
    },
    [chainInfo, dispatch, getGuardiansInfo, getVerifierServers],
  );
}
