import { DeviceEventEmitter, EmitterSubscription } from 'react-native';

const EventMap = {
  setGuardianStatus: 'setGuardianStatus',
  openBiometrics: 'openBiometrics',
  clearLoginInput: 'clearLoginInput',
  clearSetPin: 'clearSetPin',
  clearQRWallet: 'clearQRWallet',
  clearSignupInput: 'clearSignupInput',
  refreshGuardiansList: 'refreshGuardiansList',
};

// eslint-disable-next-line no-new-func
const eventsServer = new Function();

eventsServer.prototype.parseEvent = function (name: string, eventMap: any) {
  const obj: any = (this[name] = {});
  Object.keys(eventMap).forEach(key => {
    obj[key] = {
      emit: this.emit.bind(this, eventMap[key]),
      addListener: this.addListener.bind(this, eventMap[key]),
    };
  });
};

eventsServer.prototype.emit = function (eventType: string, ...params: any[]) {
  DeviceEventEmitter.emit(eventType, ...params);
};
eventsServer.prototype.addListener = function (eventType: string, listener: (data: any) => void) {
  return DeviceEventEmitter.addListener(eventType, listener);
};

eventsServer.prototype.parseEvent('base', EventMap);

export type MyEventsTypes = {
  [x in keyof typeof EventMap]: {
    emit: (...params: any[]) => void;
    addListener: (listener: (data: any) => void) => EmitterSubscription;
  };
};
const myEvents = eventsServer.prototype.base;

export default myEvents as unknown as MyEventsTypes;
