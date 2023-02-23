import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { resetSettings } from '@portkey/store/settings/slice';

import navigationService from 'utils/navigationService';
import { resetNetwork } from '@portkey/store/network/actions';

import { resetWallet } from '@portkey/store/store-ca/wallet/actions';
import { resetUser } from 'store/user/actions';
import { clearAssets } from '@portkey/store/store-ca/assets/slice';

import { resetGuardiansState } from '@portkey/store/store-ca/guardians/actions';
import { resetContactAction } from '@portkey/store/store-ca/contact/actions';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    try {
      dispatch(resetWallet());
      dispatch(resetUser());
      dispatch(clearAssets());
      dispatch(resetSettings());
      dispatch(resetNetwork());
      dispatch(resetGuardiansState());
      dispatch(resetContactAction());
      navigationService.reset('Referral');
    } catch (error) {
      console.log(error, '====error');
    }
  }, [dispatch]);
}
