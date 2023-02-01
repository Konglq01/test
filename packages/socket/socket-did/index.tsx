import Signalr from '..';
import { SinOutput } from './types';
import { listenList } from '@portkey/constants/constants-ca/socket';

class SignalrDid extends Signalr {
  public Ack(clientId: string, requestId: string) {
    this.invoke('Ack', clientId, requestId);
  }

  public onSinAndAck(
    { clientId, requestId }: { clientId: string; requestId: string },
    callback: (data: SinOutput) => void,
  ) {
    this.listen('caAccountRegister', (data: SinOutput) => {
      console.log(data, 'caAccountRegister====');
      // if (data.requestId === requestId) {
      //   this.Ack(clientId, requestId);
      //   callback(data);
      // }
    });
  }

  public onCaAccountRegister(
    { clientId, requestId }: { clientId: string; requestId: string },
    callback: (data: SinOutput) => void,
  ) {
    this.listen('caAccountRegister', (data: SinOutput) => {
      console.log(data, 'caAccountRegister====');
      // if (data.requestId === requestId) {
      //   this.Ack(clientId, requestId);
      //   callback(data);
      // }
    });
  }

  public onCaAccountRecover(
    { clientId, requestId }: { clientId: string; requestId: string },
    callback: (data: SinOutput) => void,
  ) {
    this.listen('caAccountRecover', (data: SinOutput) => {
      console.log(data, 'caAccountRecover====');
      // if (data.requestId === requestId) {
      //   this.Ack(clientId, requestId);
      //   callback(data);
      // }
    });
  }
}

const signalrDid = new SignalrDid({
  listenList,
}) as Signalr<typeof listenList> & SignalrDid;

export default signalrDid;
