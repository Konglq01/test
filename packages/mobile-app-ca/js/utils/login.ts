import { GUARDIAN_TYPE_TYPE, LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { resetWallet } from '@portkey/store/store-ca/wallet/actions';
import { GuardiansInfo } from '@portkey/types/guardian';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierItem } from '@portkey/types/verifier';
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

export function handleGuardiansApproved(guardiansStatus: GuardiansStatus, userGuardiansList: UserGuardianItem[]) {
  return Object.keys(guardiansStatus).map(key => {
    const status = guardiansStatus?.[key];
    const guardian = userGuardiansList?.find(item => item.key === key);
    return {
      ...status?.verifierInfo,
      value: guardian?.guardianAccount,
      guardianType: guardian?.guardianType,
      type: LoginStrType[guardian?.guardianType as LoginType],
    };
  });
}
