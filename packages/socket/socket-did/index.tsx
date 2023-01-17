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
    this.listen('Sin', (data: SinOutput) => {
      if (data.requestId === requestId) {
        this.Ack(clientId, requestId);
        callback(data);
      }
    });
  }
}

const signalrDid = new SignalrDid({
  listenList,
}) as Signalr<typeof listenList> & SignalrDid;

export default signalrDid;
