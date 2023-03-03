import { useCallback } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { resetSettings } from '@portkey-wallet/store/settings/slice';
import { resetNetwork } from '@portkey-wallet/store/network/actions';
import { resetWallet } from '@portkey-wallet/store/store-ca/wallet/actions';
import { resetToken } from '@portkey-wallet/store/token/slice';
import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';
import { clearAssets } from '@portkey-wallet/store/store-ca/assets/slice';
import { resetContactAction } from '@portkey-wallet/store/store-ca/contact/actions';
import { request } from '@portkey-wallet/api/api-did';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    try {
      dispatch(resetWallet());
      dispatch(resetToken());
      dispatch(resetSettings());
      dispatch(resetNetwork());
      dispatch(resetGuardiansState());
      dispatch(resetLoginInfoAction());
      dispatch(clearAssets());
      dispatch(resetContactAction());
      request.initService();
      setTimeout(() => {
        request.initService();
      }, 2000);
    } catch (error) {
      console.log(error, '====error');
    }
  }, [dispatch]);
}
