import { useCallback } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { resetSettings } from '@portkey/store/settings/slice';
import { resetNetwork } from '@portkey/store/network/actions';
import { resetWallet } from '@portkey/store/store-ca/wallet/actions';
import { resetToken } from '@portkey/store/token/slice';
import { resetGuardiansState } from '@portkey/store/store-ca/guardians/actions';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';

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
    } catch (error) {
      console.log(error, '====error');
    }
  }, [dispatch]);
}
