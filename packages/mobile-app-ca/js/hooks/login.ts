import { CurrentWalletType } from '@portkey/hooks/hooks-ca/wallet';
import { createWallet, setCAInfo, setManagerInfo } from '@portkey/store/store-ca/wallet/actions';
import { CAInfo, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { sleep } from '@portkey/utils';
import Loading from 'components/Loading';
import AElf from 'aelf-sdk';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { request } from 'api';
import { useCallback, useRef } from 'react';
import { useAppDispatch } from 'store/hooks';
import useBiometricsReady from './useBiometrics';
import navigationService from 'utils/navigationService';
import { intervalGetResult, onResultFail, TimerResult } from 'utils/wallet';
import CommonToast from 'components/CommonToast';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import useEffectOnce from './useEffectOnce';

export function useOnManagerAddressAndQueryResult() {
  const dispatch = useAppDispatch();
  const biometricsReady = useBiometricsReady();
  const timer = useRef<TimerResult>();
  const { apiUrl } = useCurrentNetworkInfo();
  useEffectOnce(() => {
    return () => {
      timer.current?.remove();
    };
  });
  return useCallback(
    async ({
      managerInfo,
      walletInfo,
      guardianCount,
      confirmPin,
    }: {
      managerInfo: ManagerInfo;
      walletInfo?: CurrentWalletType;
      guardianCount?: number;
      confirmPin: string;
    }) => {
      Loading.show();
      await sleep(1000);
      const isRecovery = managerInfo.verificationType === VerificationType.communityRecovery;
      try {
        const tmpWalletInfo = walletInfo?.address ? walletInfo : AElf.wallet.createNewWallet();
        const data: any = {
          ...managerInfo,
          chainId: DefaultChainId,
          managerAddress: tmpWalletInfo.address,
          deviceString: JSON.stringify(new Date().getTime()),
        };
        let fetch = request.register;
        if (isRecovery) {
          fetch = request.recovery;
          data.guardianCount = guardianCount;
        }
        await fetch.managerAddress({
          baseURL: apiUrl,
          data,
        });
        // whether there is wallet information
        if (walletInfo?.address) {
          dispatch(setManagerInfo({ managerInfo, pin: confirmPin }));
        } else {
          dispatch(createWallet({ walletInfo: tmpWalletInfo, managerInfo: managerInfo, pin: confirmPin }));
        }
        if (biometricsReady) {
          Loading.hide();
          navigationService.navigate('SetBiometrics', { pin: confirmPin });
        } else {
          timer.current = intervalGetResult({
            apiUrl,
            managerInfo,
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
        console.log(error, '=====error');

        Loading.hide();
        CommonToast.failError(error);
      }
    },
    [apiUrl, biometricsReady, dispatch],
  );
}
