import { useCallback } from 'react';
import { DeviceInfoType } from '@portkey-wallet/types/types-ca/device';
import { DEVICE_TYPE } from 'constants/common';
import { DEVICE_TYPE_INFO } from '@portkey-wallet/constants/constants-ca/device';

export const useGetDeviceInfo = () => {
  return useCallback(
    (): DeviceInfoType => ({
      deviceType: DEVICE_TYPE,
      deviceName: DEVICE_TYPE_INFO[DEVICE_TYPE].deviceName,
    }),
    [],
  );
};
