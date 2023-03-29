import { useCallback } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { setGuardiansAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';

const useGuardiansList = () => {
  const dispatch = useAppDispatch();

  const originChainId = useOriginChainId();

  const fetch = useCallback(
    async (paramsOption: { guardianIdentifier?: string; caHash?: string }) => {
      try {
        if (paramsOption?.guardianIdentifier)
          paramsOption.guardianIdentifier = paramsOption.guardianIdentifier.replaceAll(' ', '');
        const res = await getHolderInfo({
          chainId: originChainId,
          ...paramsOption,
        });
        dispatch(setGuardiansAction(res));
      } catch (error: any) {
        throw contractErrorHandler(error);
      }
    },
    [dispatch, originChainId],
  );

  return fetch;
};

export default useGuardiansList;
