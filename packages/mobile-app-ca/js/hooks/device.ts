import { useCallback } from 'react';
import { DeviceInfoType } from '@portkey-wallet/types/types-ca/device';
import { DEVICE_NAME } from 'constants/common';

export const useGetDeviceInfo = () => {
  return useCallback(
    (): DeviceInfoType => ({
      deviceName: DEVICE_NAME || '',
    }),
    [],
  );
};
