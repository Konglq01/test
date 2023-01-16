import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useGetCurrentCAViewContract } from './contract';
import { setGuardiansAction, setVerifierListAction } from '@portkey/store/store-ca/guardians/actions';
import { LoginInfo } from 'types/wallet';
import { EmailError } from '@portkey/utils/check';
import { VerifierItem } from '@portkey/types/verifier';

// TODO: adjust this hooks name
export const useGetGuardiansList = () => {
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  const getGuardiansList = useCallback(
    async (loginAccount: LoginInfo) => {
      if (!loginAccount) throw new Error('Could not find accountInfo');
      const caContract = await getCurrentCAViewContract();
      const res = await caContract?.callViewMethod('GetHolderInfo', {
        caHash: loginAccount.caHash,
        loginGuardianType: loginAccount.loginGuardianType,
      });
      console.log(res, '=====res');

      if (!res?.error) {
        return res.guardiansInfo;
      } else {
        if (res.error?.message && res.error.message.includes('Not found ca_hash'))
          throw new Error(EmailError.noAccount);
        throw res.error;
      }
    },
    [getCurrentCAViewContract],
  );

  return getGuardiansList;
};

export const useGetHolderInfo = () => {
  const dispatch = useAppDispatch();
  const getGuardiansList = useGetGuardiansList();
  const onGetGuardiansList = useCallback(
    async (loginAccount: LoginInfo) => {
      const guardiansInfo = await getGuardiansList(loginAccount);
      dispatch(setGuardiansAction(guardiansInfo));
      return guardiansInfo;
    },
    [dispatch, getGuardiansList],
  );

  return onGetGuardiansList;
};
export const useGetVerifierServers = () => {
  const dispatch = useAppDispatch();
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  const getGuardiansList = useCallback(async () => {
    const caContract = await getCurrentCAViewContract();
    const res = await caContract?.callViewMethod('GetVerifierServers', '');
    if (res && !res.error) {
      const verifierList: VerifierItem[] = res.verifierServers.map((item: any) => ({
        name: item.name,
        url: item.endPoints[0],
        imageUrl: item.imageUrl,
      }));
      dispatch(setVerifierListAction(verifierList));
      return verifierList;
    } else {
      throw res?.error || { message: 'Could not find VerifierServers' };
    }
  }, [dispatch, getCurrentCAViewContract]);

  return getGuardiansList;
};
