import { useCallback } from 'react';
import { DeviceInfoType, UpdateNotify, VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { DEVICE_TYPE } from 'constants/common';
import { DEVICE_TYPE_INFO } from '@portkey-wallet/constants/constants-ca/device';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import * as Application from 'expo-application';
import { request } from '@portkey-wallet/api/api-did';
import { ButtonRowProps } from 'components/ButtonRow';
import { Linking, Platform } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import ActionSheet from 'components/ActionSheet';
import { compareVersions } from '@portkey-wallet/utils/device';

export const useGetDeviceInfo = () => {
  return useCallback(
    (): DeviceInfoType => ({
      deviceType: DEVICE_TYPE,
      deviceName: DEVICE_TYPE_INFO[DEVICE_TYPE].deviceName,
    }),
    [],
  );
};

export function useCheckUpdate() {
  return useLockCallback(async () => {
    try {
      const currentVersion = Application.nativeApplicationVersion;
      const req: UpdateNotify = await request.wallet.pullNotify({
        method: 'POST',
        params: {
          deviceId: 'deviceId',
          deviceType: Platform.OS === 'android' ? VersionDeviceType.Android : VersionDeviceType.iOS,
          appVersion: currentVersion,
          appId: '10001',
        },
      });
      if (req.targetVersion && currentVersion) {
        // compare current and target versions
        if (compareVersions(currentVersion, req.targetVersion) === -1) {
          const buttons: ButtonRowProps['buttons'] = [
            {
              title: 'Update',
              onPress: () => Linking.openURL(req.downloadUrl),
            },
          ];
          if (!req.isForceUpdate) buttons.push({ type: 'outline', title: 'Cancel', onPress: OverlayModal.hide });
          OverlayModal.destroy();
          ActionSheet.alert({
            title: req.title,
            message: req.content,
            buttons,
            autoClose: false,
          });
        }
      }
    } catch (error) {
      console.log(error, '=====error');
    }
  }, []);
}
