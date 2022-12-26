import { resetWallet } from '@portkey/store/wallet/actions';
import ActionSheet from 'components/ActionSheet';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { resetUser } from 'store/user/actions';
import { resetToken } from '@portkey/store/token/slice';
import { resetSettings } from '@portkey/store/settings/slice';

import navigationService from 'utils/navigationService';
import { resetNetwork } from '@portkey/store/network/actions';
import i18n from 'i18n';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    ActionSheet.alert({
      title: i18n.t('Have you Written Down your Recovery Phrase?'),
      message: i18n.t(
        `This session will be closed after you click 'Yes' and you will not be able to access the current wallet without your Secret Recovery Phrase`,
      ) as string,
      buttons: [
        { title: i18n.t('No'), type: 'outline' },
        {
          title: i18n.t('Yes'),
          type: 'primary',
          onPress: () => {
            try {
              dispatch(resetWallet());
              dispatch(resetUser());
              dispatch(resetToken());
              dispatch(resetSettings());
              dispatch(resetNetwork());
              navigationService.reset('Entrance');
            } catch (error) {
              console.log(error, '====error');
            }
          },
        },
      ],
    });
  }, [dispatch]);
}
