import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useGetCurrentCAViewContract } from './contract';
import { setGuardiansAction, setVerifierListAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { LoginInfo } from 'types/wallet';
import { checkHolderError } from '@portkey-wallet/utils/check';
import { VerifierItem } from '@portkey-wallet/types/verifier';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { request } from '@portkey-wallet/api/api-did';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { handleErrorMessage, handleErrorCode, handlePhoneNumber } from '@portkey-wallet/utils';

export const useGetHolderInfoByViewContract = () => {
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  return useCallback(
    async (loginInfo: LoginInfo, chainInfo?: ChainItemType) => {
      if (!loginInfo) throw new Error('Could not find accountInfo');
      const caContract = await getCurrentCAViewContract(chainInfo);
      return caContract?.callViewMethod('GetHolderInfo', {
        caHash: loginInfo.caHash,
        loginGuardianIdentifierHash: loginInfo.loginAccount,
      });
    },
    [getCurrentCAViewContract],
  );
};

export const useGetHolderInfo = () => {
  return useCallback(async (loginInfo: LoginInfo, _chainInfo?: ChainItemType) => {
    if (!loginInfo) throw new Error('Could not find accountInfo');
    return request.wallet.guardianIdentifiers({
      params: {
        chainId: DefaultChainId,
        ...loginInfo,
        guardianIdentifier: loginInfo.guardianIdentifier?.includes('+')
          ? handlePhoneNumber(loginInfo.guardianIdentifier)
          : loginInfo.guardianIdentifier,
      },
    });
  }, []);
};

export const useGetGuardiansInfo = () => {
  const getHolderInfo = useGetHolderInfo();
  return useCallback(
    async (loginInfo: LoginInfo, chainInfo?: ChainItemType) => {
      try {
        const res = await getHolderInfo(loginInfo, chainInfo);
        if (res && !res.error) return res?.data || res;
        throw new Error(checkHolderError(res.error?.message));
      } catch (error: any) {
        const code = handleErrorCode(error);
        const message = handleErrorMessage(error);
        throw { message: checkHolderError(message, code), code };
      }
    },
    [getHolderInfo],
  );
};

export const useGetGuardiansInfoWriteStore = () => {
  const dispatch = useAppDispatch();
  const getGetGuardiansInfo = useGetGuardiansInfo();
  return useCallback(
    async (loginInfo: LoginInfo, chainInfo?: ChainItemType) => {
      const guardiansInfo = await getGetGuardiansInfo(loginInfo, chainInfo);
      dispatch(setGuardiansAction(guardiansInfo));
      return guardiansInfo;
    },
    [dispatch, getGetGuardiansInfo],
  );
};
export const useGetVerifierServers = () => {
  const dispatch = useAppDispatch();
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  return useCallback(
    async (chainInfo?: ChainItemType) => {
      const caContract = await getCurrentCAViewContract(chainInfo);
      const res = await caContract?.callViewMethod('GetVerifierServers', '');
      if (res && !res.error) {
        const verifierList: VerifierItem[] = res.data.verifierServers.map((item: VerifierItem) => ({
          ...item,
          url: item.endPoints[0],
        }));
        dispatch(setVerifierListAction(verifierList));
        return verifierList;
      } else {
        throw res?.error || { message: 'Could not find VerifierServers' };
      }
    },
    [dispatch, getCurrentCAViewContract],
  );
};
