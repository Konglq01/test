import { LoginStrType } from '@portkey-wallet/constants/constants-ca/guardian';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { resetWallet } from '@portkey-wallet/store/store-ca/wallet/actions';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import ActionSheet from 'components/ActionSheet';
import { GuardiansStatus } from 'pages/Guardian/types';
import { AppDispatch } from 'store';
import { resetUser } from 'store/user/actions';
import navigationService from './navigationService';

export function queryFailAlert(dispatch: AppDispatch, isRecovery?: boolean, isReset?: boolean) {
  ActionSheet.alert({
    message: isRecovery ? 'Wallet Recovery Failed!' : 'Wallet Register Failed!',
    buttons: [
      {
        title: isRecovery ? 'Re-login' : 'Re-register',
        onPress: () => {
          dispatch(resetWallet());
          dispatch(resetUser());
          if (isRecovery) {
            if (isReset) navigationService.reset('LoginPortkey');
            else navigationService.navigate('LoginPortkey');
          } else {
            if (isReset) navigationService.reset([{ name: 'LoginPortkey' }, { name: 'SignupPortkey' }]);
            else navigationService.navigate('SignupPortkey');
          }
        },
      },
    ],
  });
}

export function handleGuardiansApproved(guardiansStatus: GuardiansStatus, userGuardiansList: UserGuardianItem[]) {
  return Object.keys(guardiansStatus)
    .map(key => {
      const status = guardiansStatus?.[key];
      const guardian = userGuardiansList?.find(item => item.key === key);
      return {
        ...status?.verifierInfo,
        value: guardian?.guardianAccount,
        guardianType: guardian?.guardianType,
        type: LoginStrType[guardian?.guardianType as LoginType],
      };
    })
    .filter(item => item.signature && item.verificationDoc);
}
