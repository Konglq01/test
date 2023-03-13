import { DeviceInfoType, DeviceType } from '@portkey-wallet/types/types-ca/device';

export const DEVICE_VERSION = '1.0.0';

export const DEVICE_TYPE_INFO: Record<DeviceType, DeviceInfoType> = {
  [DeviceType.other]: {
    deviceName: 'Other',
  },
  [DeviceType.mac]: {
    deviceName: 'macOS',
  },
  [DeviceType.ios]: {
    deviceName: 'iPhone',
  },
  [DeviceType.windows]: {
    deviceName: 'Windows',
  },
  [DeviceType.android]: {
    deviceName: 'Android',
  },
};
