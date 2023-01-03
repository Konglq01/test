import { resetWallet } from '@portkey/store/store-ca/wallet/actions';
import { VerifierItem } from '@portkey/types/verifier';
import ActionSheet from 'components/ActionSheet';
import { AppDispatch } from 'store';
import navigationService from './navigationService';

export function queryFailAlert(dispatch: AppDispatch, isRecovery?: boolean) {
  ActionSheet.alert({
    message: isRecovery ? 'Wallet Recovery Failed!' : 'Wallet Register Failed!',
    buttons: [
      {
        title: isRecovery ? 'Re-login' : 'Re-register',
        onPress: () => {
          dispatch(resetWallet());
          if (isRecovery) {
            navigationService.navigate('LoginPortkey');
          } else {
            navigationService.navigate('SignupPortkey');
          }
        },
      },
    ],
  });
}
export function handleUserGuardiansList(holderInfo: any, verifierServers: VerifierItem[]) {
  return holderInfo.guardians.map((item: any) => {
    return {
      ...item,
      loginGuardianType: item.guardianType.guardianType,
      guardiansType: 0,
      key: `${item.guardianType.guardianType}&${item.verifier.name}`,
      verifier: verifierServers.find(verifier => verifier.name === item.verifier.name),
    };
  });
}
