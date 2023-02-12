import { DeviceType } from '@portkey/types/types-ca/wallet';

export default function getDevice() {
  const agent = navigator.userAgent.toLowerCase();
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  if (isMac) {
    return DeviceType.mac;
  }
  if (agent.indexOf('win') >= 0 || agent.indexOf('wow') >= 0) {
    return DeviceType.windows;
  }
  return DeviceType.other;
}
