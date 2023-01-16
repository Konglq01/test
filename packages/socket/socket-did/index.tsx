import Signalr, { ISignalrOption } from '..';
import { SocketUrl, listenList } from '@portkey/constants/constants-ca/socket';

class SignalrDid extends Signalr {
  public RequestTradeRecord(chainId: string, tradePairId: string, maxResultCount?: number) {
    this.invoke('RequestTradeRecord', chainId, tradePairId, maxResultCount ?? 20);
  }
}

const signalrDid = new SignalrDid({
  listenList,
}) as Signalr<typeof listenList> & SignalrDid;

export default signalrDid;
