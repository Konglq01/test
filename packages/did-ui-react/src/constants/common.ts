import { DeviceType } from '@portkey/types/types-ca/wallet';

// device
export const DEVICE_TYPE = (() => {
  if (typeof navigator !== 'undefined') {
    const agent = navigator.userAgent.toLowerCase();
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (isMac) {
      return DeviceType.mac;
    }
    if (agent.indexOf('win') >= 0 || agent.indexOf('wow') >= 0) {
      return DeviceType.windows;
    }
    return DeviceType.other;
  } else {
    return DeviceType.other;
  }
})();
