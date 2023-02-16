import { getWalletCAAddressByApi } from '@portkey/hooks/hooks-ca/wallet-result';
import { VerificationType } from '@portkey/types/verifier';
import { useCallback } from 'react';
// import { contractErrorHandler } from 'utils/tryErrorHandler';

export default function useFetchDidWalletInfo() {
  const fetch = useCallback(
    async ({
      baseURL,
      sessionId,
      verificationType,
    }: {
      baseURL: string;
      managerAddress: string;
      sessionId: string;
      verificationType: VerificationType;
    }) => {
      const walletResult = await getWalletCAAddressByApi({
        baseURL,
        verificationType,
        managerUniqueId: sessionId,
      });

      console.log(walletResult, 'walletResult===');
      if (walletResult.status !== 'pass') {
        const errorString = walletResult?.message || walletResult.status;
        throw (errorString as string) || 'Something error';
      } else {
        return walletResult;
      }
    },
    [],
  );
  return fetch;
}
