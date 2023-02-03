import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useGetCurrentCAViewContract } from './contract';
import { setGuardiansAction, setVerifierListAction } from '@portkey/store/store-ca/guardians/actions';
import { LoginInfo } from 'types/wallet';
import { checkHolderError } from '@portkey/utils/check';
import { VerifierItem } from '@portkey/types/verifier';

export const useGetHolderInfo = () => {
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  return useCallback(
    async (loginInfo: LoginInfo) => {
      if (!loginInfo) throw new Error('Could not find accountInfo');
      const caContract = await getCurrentCAViewContract();
      return caContract?.callViewMethod('GetHolderInfo', {
        caHash: loginInfo.caHash,
        loginGuardianAccount: loginInfo.loginAccount,
      });
    },
    [getCurrentCAViewContract],
  );
};

export const useGetGuardiansInfo = () => {
  const getHolderInfo = useGetHolderInfo();
  return useCallback(
    async (loginInfo: LoginInfo) => {
      const res = await getHolderInfo(loginInfo);
      if (res && !res.error) return res.guardiansInfo;
      throw new Error(checkHolderError(res.error?.message));
    },
    [getHolderInfo],
  );
};

export const useGetGuardiansInfoWriteStore = () => {
  const dispatch = useAppDispatch();
  const getGetGuardiansInfo = useGetGuardiansInfo();
  return useCallback(
    async (loginInfo: LoginInfo) => {
      const guardiansInfo = await getGetGuardiansInfo(loginInfo);
      dispatch(setGuardiansAction(guardiansInfo));
      return guardiansInfo;
    },
    [dispatch, getGetGuardiansInfo],
  );
};
export const useGetVerifierServers = () => {
  const dispatch = useAppDispatch();
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  return useCallback(async () => {
    const caContract = await getCurrentCAViewContract();
    const res = await caContract?.callViewMethod('GetVerifierServers', '');
    if (res && !res.error) {
      const verifierList: VerifierItem[] = res.verifierServers.map((item: VerifierItem) => ({
        ...item,
        url: item.endPoints[0],
      }));
      dispatch(setVerifierListAction(verifierList));
      return verifierList;
    } else {
      throw res?.error || { message: 'Could not find VerifierServers' };
    }
  }, [dispatch, getCurrentCAViewContract]);
};
