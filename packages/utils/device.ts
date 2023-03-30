import { DEVICE_TYPE_INFO, DEVICE_INFO_VERSION } from '@portkey-wallet/constants/constants-ca/device';
import {
  DeviceInfoType,
  DeviceType,
  ExtraDataDecodeType,
  ExtraDataType,
  QRExtraDataType,
} from '@portkey-wallet/types/types-ca/device';

const checkDateNumber = (value: number): boolean => {
  return !isNaN(value) && !isNaN(new Date(value).getTime());
};

export const getDeviceInfoFromQR = (qrExtraData?: QRExtraDataType, deviceType?: DeviceType): DeviceInfoType => {
  if (qrExtraData !== undefined) {
    return {
      ...DEVICE_TYPE_INFO[DeviceType.OTHER],
      ...qrExtraData.deviceInfo,
    };
  }
  if (deviceType === undefined || DeviceType[deviceType] === undefined) {
    return DEVICE_TYPE_INFO[DeviceType.OTHER];
  }
  return DEVICE_TYPE_INFO[deviceType];
};

export const extraDataEncode = (deviceInfo: DeviceInfoType): string => {
  return JSON.stringify({
    transactionTime: Date.now(),
    deviceInfo: JSON.stringify(deviceInfo),
    version: DEVICE_INFO_VERSION,
  });
};

export const extraDataDecode = (extraDataStr: string): ExtraDataDecodeType => {
  let version = '0.0.1';
  let extraEncodeData: ExtraDataType | string = extraDataStr;

  try {
    extraEncodeData = JSON.parse(extraDataStr) as ExtraDataType;
    version = extraEncodeData.version;
  } catch (error) {
    // version = '0.0.1';
  }

  const extraData: ExtraDataDecodeType = {
    version,
    transactionTime: 0,
    deviceInfo: {
      ...DEVICE_TYPE_INFO[DeviceType.OTHER],
    },
  };

  switch (version) {
    case '0.0.1':
      if (typeof extraEncodeData !== 'string') break;
      const extraDataArray = extraEncodeData.split(',').map(itemValue => Number(itemValue));

      let deviceType: DeviceType = DeviceType.OTHER,
        transactionTime: number | undefined = undefined;
      const firstNum = extraDataArray[0];
      if (firstNum !== undefined && !isNaN(firstNum)) {
        if (DeviceType[firstNum] !== undefined) {
          deviceType = firstNum;
        } else if (checkDateNumber(firstNum)) {
          transactionTime = firstNum;
        }
      }
      const secondNum = extraDataArray[1];
      if (transactionTime === undefined && secondNum !== undefined && checkDateNumber(secondNum)) {
        transactionTime = secondNum;
      }
      extraData.deviceInfo = DEVICE_TYPE_INFO[deviceType];
      if (transactionTime) {
        extraData.transactionTime = transactionTime;
      }
      break;

    case '1.0.0':
      if (typeof extraEncodeData === 'string') break;
      try {
        extraData.deviceInfo = {
          ...extraData.deviceInfo,
          ...JSON.parse(extraEncodeData.deviceInfo),
        };
      } catch (error) {
        // extraData.deviceInfo = DEVICE_TYPE_INFO[DeviceType.OTHER];
      }
      if (checkDateNumber(extraEncodeData.transactionTime)) {
        extraData.transactionTime = extraEncodeData.transactionTime;
      }
      break;

    default:
      break;
  }

  if (extraData.deviceInfo.deviceType === undefined || DeviceType[extraData.deviceInfo.deviceType] === undefined) {
    extraData.deviceInfo.deviceType = DeviceType.OTHER;
  }

  return extraData;
};

export function compareVersions(v1: string, v2: string) {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    if (v1Part < v2Part) {
      return -1;
    } else if (v1Part > v2Part) {
      return 1;
    }
  }
  return 0;
}
