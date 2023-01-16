import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { resetSettings } from '@portkey/store/settings/slice';

import navigationService from 'utils/navigationService';
import { resetNetwork } from '@portkey/store/network/actions';

import { resetWallet } from '@portkey/store/store-ca/wallet/actions';
import { resetUser } from 'store/user/actions';
import { resetToken } from '@portkey/store/token/slice';
import { resetVerifierState } from '@portkey/store/store-ca/guardians/actions';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    try {
      dispatch(resetWallet());
      dispatch(resetUser());
      dispatch(resetToken());
      dispatch(resetSettings());
      dispatch(resetNetwork());
      dispatch(resetVerifierState());
      navigationService.reset('Referral');
    } catch (error) {
      console.log(error, '====error');
    }
  }, [dispatch]);
}
