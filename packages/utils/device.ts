import { DEVICE_VERSION } from '../constants/constants-ca/device';
import { DeviceInfoType, ExtraDataType } from '../types/types-ca/device';
import aes from './aes';

export const deviceEncode = (pin: string, deviceInfo: DeviceInfoType): string => {
  return JSON.stringify({
    transactionTime: Date.now(),
    deviceInfo: aes.encrypt(JSON.stringify(deviceInfo), pin),
    version: DEVICE_VERSION,
  });
};

export const deviceDecode = (pin: string, extraData: ExtraDataType) => {
  return {
    ...extraData,
    deviceInfo: aes.decrypt(extraData.deviceInfo, pin),
  };
};
