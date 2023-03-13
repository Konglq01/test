import { useCallback } from 'react';
import * as Device from 'expo-device';
import { DeviceInfoType } from '@portkey-wallet/types/types-ca/device';

export const useGetDeviceInfo = () => {
  return useCallback(
    (): DeviceInfoType => ({
      deviceName: Device.deviceName || '',
    }),
    [],
  );
};
