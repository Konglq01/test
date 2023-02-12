import { DeviceType, DeviceTypeInfo } from '@portkey/types/types-ca/wallet';

export const DEVICE_TYPE_INFO: Record<DeviceType, DeviceTypeInfo> = {
  [DeviceType.other]: {
    name: 'Other',
    icon: 'desk-mac',
  },
  [DeviceType.mac]: {
    name: 'macOS',
    icon: 'desk-mac',
  },
  [DeviceType.ios]: {
    name: 'iPhone',
    icon: 'phone-iOS',
  },
  [DeviceType.windows]: {
    name: 'Windows',
    icon: 'desk-win',
  },
  [DeviceType.android]: {
    name: 'Android',
    icon: 'phone-Android',
  },
};
