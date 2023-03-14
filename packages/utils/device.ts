import { DEVICE_TYPE_INFO, DEVICE_VERSION } from '@portkey-wallet/constants/constants-ca/device';
import { DeviceInfoType, DeviceType, ExtraDataDecodeType, ExtraDataType } from '@portkey-wallet/types/types-ca/device';

const checkDateNumber = (value: number): boolean => {
  return !isNaN(value) && !isNaN(new Date(value).getTime());
};

export const extraDataEncode = (deviceInfo: DeviceInfoType): string => {
  return JSON.stringify({
    transactionTime: Date.now(),
    deviceInfo: JSON.stringify(deviceInfo),
    version: DEVICE_VERSION,
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

  return extraData;
};
