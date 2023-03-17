import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';

const socialVerify = async (item: UserGuardianItem) => {
  //
  try {
    const result = await socialLoginAction(LoginType[item.guardianType] as ISocialLogin);
    return result;
    // TODO
  } catch (error) {
    //
  }
};

export default socialVerify;
