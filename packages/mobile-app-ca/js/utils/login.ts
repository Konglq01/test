import { resetWallet } from '@portkey/store/store-ca/wallet/actions';
import { VerifierItem } from '@portkey/types/verifier';
import ActionSheet from 'components/ActionSheet';
import { AppDispatch } from 'store';
import navigationService from './navigationService';

export function queryFailAlert(dispatch: AppDispatch, isRecovery?: boolean, isReset?: boolean) {
  ActionSheet.alert({
    message: isRecovery ? 'Wallet Recovery Failed!' : 'Wallet Register Failed!',
    buttons: [
      {
        title: isRecovery ? 'Re-login' : 'Re-register',
        onPress: () => {
          dispatch(resetWallet());
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
export function handleUserGuardiansList(holderInfo: any, verifierServers: VerifierItem[]) {
  return holderInfo.guardians.map((item: any, index: number) => {
    return {
      ...item,
      loginGuardianType: item.guardianType.guardianType,
      // TODO: guardiansType
      guardiansType: 0,
      key: `${item.guardianType.guardianType}&${item.verifier.name}`,
      verifier: verifierServers.find(verifier => verifier.name === item.verifier.name),
      isLoginAccount: holderInfo.loginGuardianTypeIndexes.includes(index),
    };
  });
}
