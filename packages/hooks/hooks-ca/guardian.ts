import { useCallback } from 'react';
import { request } from '@portkey-wallet/api/api-did';
import { checkHolderError } from '@portkey-wallet/utils/check';
import { handleErrorCode, handleErrorMessage } from '@portkey-wallet/utils';

export const useGetRegisterInfo = () => {
  return useCallback(async (info: { loginGuardianIdentifier?: string; caHash?: string }) => {
    try {
      return await request.wallet.getRegisterInfo({
        params: info,
      });
    } catch (error: any) {
      const code = handleErrorCode(error);
      const message = handleErrorMessage(error);
      throw { message: checkHolderError(message, code), code };
    }
  }, []);
};
