import { ErrorType } from 'types/common';
import { Platform } from 'react-native';
import { DeviceType } from '@portkey-wallet/types/types-ca/device';
import { DEVICE_TYPE_INFO } from '@portkey-wallet/constants/constants-ca/device';

export const INIT_ERROR: ErrorType = {
  errorMsg: '',
  isError: false,
};

export const INIT_NONE_ERROR: ErrorType = INIT_ERROR;

export const INIT_HAS_ERROR: ErrorType = {
  errorMsg: '',
  isError: true,
};

export const DEVICE_NAME: string | undefined = (() => {
  let deviceName: string | undefined;
  switch (Platform.OS) {
    case 'ios':
      deviceName = DEVICE_TYPE_INFO[DeviceType.IOS].deviceName;
      break;
    case 'android':
      deviceName = DEVICE_TYPE_INFO[DeviceType.ANDROID].deviceName;
      break;
    default:
      deviceName = DEVICE_TYPE_INFO[DeviceType.OTHER].deviceName;
      break;
  }
  return deviceName;
})();
