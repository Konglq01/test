import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { resetSettings } from '@portkey-wallet/store/settings/slice';

import navigationService from 'utils/navigationService';
import { resetNetwork } from '@portkey-wallet/store/network/actions';

import { resetWallet } from '@portkey-wallet/store/store-ca/wallet/actions';
import { resetUser } from 'store/user/actions';
import { clearAssets } from '@portkey-wallet/store/store-ca/assets/slice';

import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { resetContactAction } from '@portkey-wallet/store/store-ca/contact/actions';
import { request } from '@portkey-wallet/api/api-did';
import { clearRecent } from '@portkey-wallet/store/store-ca/recent/slice';

import { clearActivity } from '@portkey-wallet/store/store-ca/activity/slice';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    try {
      dispatch(resetWallet());
      dispatch(resetUser());
      dispatch(clearAssets());
      dispatch(clearRecent());
      dispatch(clearActivity());
      dispatch(resetSettings());
      dispatch(resetNetwork());
      dispatch(resetGuardiansState());
      dispatch(resetContactAction());

      request.initService();
      setTimeout(() => {
        request.initService();
      }, 2000);
      navigationService.reset('Referral');
    } catch (error) {
      console.log(error, '====error');
    }
  }, [dispatch]);
}
