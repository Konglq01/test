import { DeviceInfoType, DeviceType } from '@portkey-wallet/types/types-ca/device';

export const DEVICE_VERSION = '1.0.0';

export const DEVICE_TYPE_INFO: Record<DeviceType, DeviceInfoType> = {
  [DeviceType.OTHER]: {
    deviceName: 'Other',
  },
  [DeviceType.MAC]: {
    deviceName: 'macOS',
  },
  [DeviceType.IOS]: {
    deviceName: 'iOS',
  },
  [DeviceType.WINDOWS]: {
    deviceName: 'Windows',
  },
  [DeviceType.ANDROID]: {
    deviceName: 'Android',
  },
};
