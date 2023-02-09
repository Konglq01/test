export enum DeviceType {
  mac,
  ios,
  windows,
  android,
}

export const DEVICE_TYPE_INFO: Record<DeviceType, { name: string; icon: string }> = {
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
