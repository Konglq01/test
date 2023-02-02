import { CaAccountRecoverResult, CaAccountRegisterResult, CAInfo, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { clearTimeoutInterval, setTimeoutInterval } from '@portkey/utils/interval';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { queryFailAlert } from './login';
import { AppDispatch } from 'store';
import { ContractBasic } from './contract';
import { request } from '@portkey/api/api-did';
import myServer from '@portkey/api/server';
import { listenList } from '@portkey/constants/constants-ca/socket';
import Signalr from '@portkey/socket';

class DidSignalr extends Signalr {
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
        if (data.body.recoverStatus !== 'pending') {
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
export function intervalGetResult({
  managerInfo,
  onPass,
  onFail,
}: {
  managerInfo: ManagerInfo;
  onPass?: (caInfo: CAInfo) => void;
  onFail?: (message: string) => void;
}) {
  const socket = new DidSignalr({
    listenList,
  }) as Signalr<typeof listenList> & DidSignalr;

  let timer = '';
  let mark = false;
  const listenerList: { remove: () => void }[] = [];
  const sendResult = (result: any) => {
    if (mark) return;
    switch (result.recoveryStatus || result.registerStatus) {
      case 'pass': {
        onPass?.(result);
        break;
      }
      case 'fail': {
        onFail?.(result.recoveryMessage || result.registerMessage);
        break;
      }
      default:
        break;
    }
    // timer && clearTimeoutInterval(timer);
    listenerList.forEach(listen => listen.remove());
    mark = true;
  };
  const clientId = managerInfo.requestId || '';
  const requestId = managerInfo.requestId || '';
  socket.doOpen({
    url: `${myServer.defaultConfig.baseURL}/ca`,
    clientId: managerInfo.requestId || '',
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
        params: { filter: `id:${managerInfo.managerUniqueId}` },
      });
      sendResult(req.items[0]);
    } catch (error) {
      console.log(error, '=====error');
    }
  }, 3000);
  return {
    remove: () => {
      timer && clearTimeoutInterval(timer);
      listenerList.forEach(listen => listen.remove());
    },
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
