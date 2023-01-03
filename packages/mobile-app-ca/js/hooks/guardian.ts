import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useCurrentCAContract } from './contract';
import { setGuardiansAction, setVerifierListAction } from '@portkey/store/store-ca/guardians/actions';
import { LoginInfo } from 'types/wallet';
import { EmailError } from '@portkey/utils/check';
import { VerifierItem } from '@portkey/types/verifier';
export const useGetHolderInfo = () => {
  const dispatch = useAppDispatch();
  const caContract = useCurrentCAContract();
  const getGuardiansList = useCallback(
    async (loginAccount: LoginInfo) => {
      if (!loginAccount) throw new Error('Could not find accountInfo');
      if (!caContract) throw new Error('Could not find chain information');
      const res = await caContract?.callViewMethod('GetHolderInfo', {
        caHash: loginAccount.caHash,
        loginGuardianType: loginAccount.loginGuardianType,
      });
      console.log(res, '=====res');

      if (!res?.error) {
        dispatch(setGuardiansAction(res.guardiansInfo));
        return res.guardiansInfo;
      } else {
        if (res.error?.message && res.error.message.includes('Not found ca_hash'))
          throw new Error(EmailError.noAccount);
        throw res.error;
      }
    },
    [caContract, dispatch],
  );

  return getGuardiansList;
};
export const useGetVerifierServers = () => {
  const dispatch = useAppDispatch();
  const caContract = useCurrentCAContract();
  const getGuardiansList = useCallback(async () => {
    if (!caContract) throw new Error('Could not find chain information');
    const res = await caContract?.callViewMethod('GetVerifierServers', '');
    if (!res?.error) {
      const verifierList: VerifierItem[] = res.verifierServers?.map((item: any) => ({
        name: item.name,
        url: item.endPoints[0],
        imageUrl: item.imageUrl,
      }));
      dispatch(setVerifierListAction(verifierList));
      return verifierList;
    } else {
      throw res.error;
    }
  }, [caContract, dispatch]);

  return getGuardiansList;
};
