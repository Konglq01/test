import {
  CaAccountRecoverResult,
  CaAccountRegisterResult,
  CAInfo,
  DeviceType,
  ManagerInfo,
} from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { clearTimeoutInterval, setTimeoutInterval } from '@portkey-wallet/utils/interval';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { queryFailAlert } from './login';
import { AppDispatch } from 'store';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { request } from '@portkey-wallet/api/api-did';
import Signalr from '@portkey-wallet/socket';
import { listenList } from '@portkey-wallet/constants/constants-ca/socket';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';

class SignalrDid extends Signalr {
  public Ack(clientId: string, requestId: string) {
    this.invoke('Ack', clientId, requestId);
  }

  public onCaAccountRegister(
    { clientId, requestId }: { clientId: string; requestId: string },
    callback: (data: CaAccountRegisterResult) => void,
  ) {
    return this.listen('caAccountRegister', (data: CaAccountRegisterResult) => {
      if (data.requestId === requestId) {
        if (data.body.registerStatus !== 'pending') {
          this.Ack(clientId, requestId);
        }
        callback(data);
      }
    });
  }

  public onCaAccountRecover(
    { clientId, requestId }: { clientId: string; requestId: string },
    callback: (data: CaAccountRecoverResult) => void,
  ) {
    return this.listen('caAccountRecover', (data: CaAccountRecoverResult) => {
      if (data.requestId === requestId) {
        if (data.body.recoveryStatus !== 'pending') {
          this.Ack(clientId, requestId);
        }
        callback(data);
      }
    });
  }
}

export type TimerResult = {
  remove: () => void;
};

export type IntervalGetResultParams = {
  managerInfo: ManagerInfo;
  onPass?: (caInfo: CAInfo) => void;
  onFail?: (message: string) => void;
};

export function intervalGetResult({ managerInfo, onPass, onFail }: IntervalGetResultParams) {
  let timer = '',
    mark = false;
  const listenerList: TimerResult[] = [];
  const socket = new SignalrDid({
    listenList,
  });
  const remove = () => {
    try {
      timer && clearTimeoutInterval(timer);
      listenerList.forEach(listen => listen.remove());
      socket.stop();
    } catch (error) {
      console.debug(error);
    }
  };
  const sendResult = (result: any) => {
    if (mark) return;
    switch (result.recoveryStatus || result.registerStatus) {
      case 'pass': {
        onPass?.(result);
        remove();
        mark = true;
        break;
      }
      case 'fail': {
        onFail?.(result.recoveryMessage || result.registerMessage);
        remove();
        mark = true;
        break;
      }
      default:
        break;
    }
  };
  const clientId = managerInfo.requestId || '';
  const requestId = managerInfo.requestId || '';
  socket.doOpen({
    url: `${request.defaultConfig.baseURL}/ca`,
    clientId,
  });
  let fetch: any;
  if (managerInfo.verificationType !== VerificationType.register) {
    fetch = request.es.getRecoverResult;
    listenerList.push(
      socket.onCaAccountRecover({ clientId, requestId }, data => {
        sendResult(data.body);
      }),
    );
  } else {
    fetch = request.es.getRegisterResult;
    listenerList.push(
      socket.onCaAccountRegister({ clientId, requestId }, data => {
        sendResult(data.body);
      }),
    );
  }
  timer = setTimeoutInterval(async () => {
    try {
      const req = await fetch({
        params: { filter: `_id:${managerInfo.managerUniqueId}` },
      });
      sendResult(req.items[0]);
    } catch (error) {
      console.debug(error, '=====error');
    }
  }, 3000);
  return { remove };
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
  deviceType,
}: {
  contract: ContractBasic;
  address: string;
  caHash: string;
  managerAddress?: LoginQRData['address'];
  deviceType?: LoginQRData['deviceType'];
}) {
  return contract.callSendMethod('AddManager', address, {
    caHash,
    manager: {
      managerAddress,
      deviceString: `${deviceType !== undefined ? deviceType + ',' : ''}${Date.now()}`,
    },
  });
}
