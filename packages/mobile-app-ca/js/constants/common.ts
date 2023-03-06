import { ErrorType } from 'types/common';
import { Platform } from 'react-native';
import { DeviceType } from '@portkey-wallet/types/types-ca/wallet';

export const INIT_ERROR: ErrorType = {
  errorMsg: '',
  isError: false,
};

export const INIT_NONE_ERROR: ErrorType = INIT_ERROR;

export const INIT_HAS_ERROR: ErrorType = {
  errorMsg: '',
  isError: true,
};

export const DEVICE_TYPE: DeviceType = (() => {
  let deviceType: DeviceType;
  switch (Platform.OS) {
    case 'ios':
      deviceType = DeviceType.ios;
      break;
    case 'android':
      deviceType = DeviceType.android;
      break;
    default:
      deviceType = DeviceType.other;
      break;
  }
  return deviceType;
})();
