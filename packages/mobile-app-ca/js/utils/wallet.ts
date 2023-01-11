import { request } from 'api';
import { CAInfo, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { clearTimeoutInterval, setTimeoutInterval } from '@portkey/utils/interval';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { queryFailAlert } from './login';
import { AppDispatch } from 'store';
import { ContractBasic } from './contract';

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
  let fetch = request.register;
  if (managerInfo.verificationType !== VerificationType.register) fetch = request.recovery;
  const timer = setTimeoutInterval(async () => {
    try {
      const req = await fetch.result({
        baseURL: apiUrl,
        data: managerInfo,
      });
      console.log(req, '====req');

      switch (req.recoveryStatus || req.registerStatus) {
        case 'pass': {
          clearTimeoutInterval(timer);
          onPass?.(req);
          break;
        }
        case 'fail': {
          clearTimeoutInterval(timer);
          onFail?.(req.recoveryMessage || req.registerMessage);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error, '=====error');
    }
  }, 3000);
  console.log(timer, '====timer');

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
