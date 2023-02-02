import Signalr from '..';
import { CaAccountRecoverResult, CaAccountRegisterResult } from '@portkey/types/types-ca/wallet';
import { listenList } from '@portkey/constants/constants-ca/socket';

class SignalrDid extends Signalr {
  public Ack(clientId: string, requestId: string) {
    this.invoke('Ack', clientId, requestId);
  }

  public onCaAccountRegister(
    { clientId, requestId }: { clientId: string; requestId: string },
    callback: (data: CaAccountRegisterResult) => void,
  ) {
    this.listen('caAccountRegister', (data: CaAccountRegisterResult) => {
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
    this.listen('caAccountRecover', (data: CaAccountRecoverResult) => {
      if (data.requestId === requestId) {
        if (data.body.recoveryStatus !== 'pending') {
          this.Ack(clientId, requestId);
        }
        callback(data);
      }
    });
  }
}

const signalrDid = new SignalrDid({
  listenList,
}) as Signalr<typeof listenList> & SignalrDid;

export default signalrDid;
