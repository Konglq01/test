import { CurrentWalletType } from '@portkey/hooks/hooks-ca/wallet';
import { createWallet, setCAInfo, setManagerInfo } from '@portkey/store/store-ca/wallet/actions';
import { CAInfo, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType, VerifierInfo } from '@portkey/types/verifier';
import { sleep } from '@portkey/utils';
import Loading from 'components/Loading';
import AElf from 'aelf-sdk';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
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
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { GuardiansApproved } from 'pages/Guardian/types';

export function useOnManagerAddressAndQueryResult() {
  const dispatch = useAppDispatch();
  const biometricsReady = useBiometricsReady();
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
          loginGuardianAccount: managerInfo.loginAccount,
          managerAddress: tmpWalletInfo.address,
          deviceString: new Date().getTime().toString(),
          context: {
            clientId: tmpWalletInfo.address,
            requestId: tmpWalletInfo.address,
          },
          chainId: DefaultChainId,
        };
        console.log(data, JSON.stringify(data), '====data');

        let fetch = request.verify.registerRequest;
        if (isRecovery) {
          fetch = request.verify.recoveryRequest;
          data.guardiansApproved = guardiansApproved;
        } else {
          data = {
            ...managerInfo,
            ...verifierInfo,
            type: LoginStrType[managerInfo.type],
            ...data,
          };
        }
        console.log(data, '====data');

        const req = await fetch({
          data,
        });
        console.log(req, '=====req');

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
    [biometricsReady, dispatch, onIntervalGetResult],
  );
}

export function useIntervalGetResult() {
  return useCallback((params: IntervalGetResultParams) => intervalGetResult(params), []);
}
