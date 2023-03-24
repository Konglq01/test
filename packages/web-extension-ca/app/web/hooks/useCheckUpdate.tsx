import { request } from '@portkey-wallet/api/api-did';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { UpdateNotify, VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { compareVersions } from '@portkey-wallet/utils/device';
import { Modal, ModalFuncProps } from 'antd';

export function useCheckUpdate() {
  return useLockCallback(async () => {
    try {
      const currentVersion = process.env.SDK_VERSION?.replace('v', '');
      const req: UpdateNotify = await request.wallet.pullNotify({
        method: 'POST',
        params: {
          deviceId: 'deviceId',
          deviceType: VersionDeviceType.Extension,
          appVersion: currentVersion,
          appId: '10001',
        },
      });
      if (req.targetVersion && currentVersion) {
        // compare current and target versions
        if (compareVersions(currentVersion, req.targetVersion) === -1) {
          let modalType: ModalFuncProps['type'] = 'warning';
          const modalProps: ModalFuncProps = {
            width: 320,
            icon: null,
            className: 'cross-modal delete-modal',
            content: (
              <>
                {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
                <div style={{ fontWeight: 500 }}>{req.title}</div>
                <div>{req.content}</div>
              </>
            ),
            closable: false,
            centered: true,
            autoFocusButton: null,
            okButtonProps: { style: { width: '100%' } },
            onOk: () => {
              window.open(req.downloadUrl);
              return Promise.reject();
            },
          };
          if (!req.isForceUpdate) {
            modalType = 'confirm';
            modalProps.okButtonProps = undefined;
          }
          Modal[modalType](modalProps);
        }
      }
    } catch (error) {
      console.log(error, '=====error');
    }
  }, []);
}
