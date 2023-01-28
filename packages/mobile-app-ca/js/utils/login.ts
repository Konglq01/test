import { GUARDIAN_TYPE_TYPE } from '@portkey/store/store-ca/guardians/utils';
import { resetWallet } from '@portkey/store/store-ca/wallet/actions';
import { GuardiansInfo } from '@portkey/types/guardian';
import { VerifierItem } from '@portkey/types/verifier';
import ActionSheet from 'components/ActionSheet';
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
export function handleUserGuardiansList(holderInfo: GuardiansInfo, verifierServers: VerifierItem[]) {
  const { loginGuardianAccountIndexes, guardianAccounts } = holderInfo;
  return guardianAccounts.map((item, index: number) => {
    const { value, guardian } = item;

    return {
      ...item,
      guardianAccount: value,
      guardianType: typeof guardian.type === 'string' ? (GUARDIAN_TYPE_TYPE as any)[guardian.type] : guardian.type,
      key: `${value}&${guardian.verifier.id}`,
      verifier: verifierServers.find(verifierItem => verifierItem.id === guardian.verifier.id),
      isLoginAccount: loginGuardianAccountIndexes.includes(index),
    };
  });
}
