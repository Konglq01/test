import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { resetUserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CustomSvg from 'components/CustomSvg';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { DeviceItemType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import { dateFormat } from 'utils';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { getDeviceIcon } from 'utils/device';

interface DeviceDetailProps {
  device: DeviceItemType;
  isCurrent: boolean;
}

export default function DeviceDetail(props: DeviceDetailProps) {
  const { t } = useTranslation();
  const { device, isCurrent } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userGuardianList = useGuardianList();
  const { walletInfo } = useCurrentWallet();

  const handleDelete = useCallback(async () => {
    dispatch(
      setLoginAccountAction({
        guardianAccount: walletInfo.managerInfo?.loginAccount as string,
        loginType: walletInfo.managerInfo?.type as LoginType,
      }),
    );
    dispatch(resetUserGuardianStatus());
    await userGuardianList({ caHash: walletInfo.caHash });
    navigate('/setting/wallet-security/manage-devices/guardian-approval', {
      state: `removeManage_${device.managerAddress}`,
    });
  }, [device, dispatch, navigate, userGuardianList, walletInfo]);

  return (
    <div className="device-detail">
      <div className="content-item">
        <div className="item-desc">
          <div className="flex-center icon">
            <CustomSvg type={getDeviceIcon(device.deviceInfo.deviceType || DeviceType.OTHER)} />
          </div>
          <div className="name">{device.deviceInfo.deviceName}</div>
          {walletInfo.address === device.managerAddress && <div className="flex-center tag">{t('Current')}</div>}
        </div>
        <div className="item-time">
          {device.transactionTime && <div className="time">{dateFormat(device.transactionTime)}</div>}
        </div>
      </div>
      {!isCurrent && (
        <>
          <div className="desc">
            {t(
              "Your account is logged in on this device. You may delete this device to remove its access to your account. You'll need to verify your identity through your guardians next time you log in to Portkey from this device.",
            )}
          </div>
          <div className="device-detail-btn">
            <Button type="primary" htmlType="submit" onClick={handleDelete}>
              {t('Delete Device')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
