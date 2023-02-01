import { CAInfo, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { clearTimeoutInterval, setTimeoutInterval } from '@portkey/utils/interval';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { queryFailAlert } from './login';
import { AppDispatch } from 'store';
import { ContractBasic } from './contract';
import { request } from '@portkey/api/api-did';

export type TimerResult = {
  remove: () => void;
};
export function intervalGetResult({
  apiUrl,
  managerInfo,
  onPass,
  onFail,
}: {
  apiUrl: string;
  managerInfo: ManagerInfo;
  onPass?: (caInfo: CAInfo) => void;
  onFail?: (message: string) => void;
}) {
  let fetch = request.es.getRegisterResult;
  if (managerInfo.verificationType !== VerificationType.register) fetch = request.es.getRecoverResult;
  const timer = setTimeoutInterval(async () => {
    try {
      const req = await fetch({
        baseURL: apiUrl,
        params: { filter: `id:${managerInfo.managerUniqueId}` },
      });
      const result = req.items[0];
      switch (result.recoveryStatus || result.registerStatus) {
        case 'pass': {
          clearTimeoutInterval(timer);
          onPass?.(result);
          break;
        }
        case 'fail': {
          clearTimeoutInterval(timer);
          onFail?.(result.recoveryMessage || result.registerMessage);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error, '=====error');
    }
  }, 3000);
  return {
    remove: () => clearTimeoutInterval(timer),
  };
}

export function onResultFail(dispatch: AppDispatch, message: string, isRecovery?: boolean, isReset?: boolean) {
  Loading.hide();
  CommonToast.fail(message);
  queryFailAlert(dispatch, isRecovery, isReset);
}

export async function addManager({
  contract,
  address,
  caHash,
  managerAddress,
}: {
  contract: ContractBasic;
  address: string;
  caHash: string;
  managerAddress?: string;
}) {
  return contract.callSendMethod('AddManager', address, {
    caHash,
    manager: {
      managerAddress,
      deviceString: new Date().getTime(),
    },
  });
}
