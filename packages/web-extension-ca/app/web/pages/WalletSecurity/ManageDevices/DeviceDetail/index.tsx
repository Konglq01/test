import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { resetUserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { useCurrentWallet, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CustomSvg from 'components/CustomSvg';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { DeviceType } from '@portkey-wallet/types/types-ca/device';
import { dateFormat } from 'utils';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { getDeviceIcon } from 'utils/device';
import BackHeader from 'components/BackHeader';
import './index.less';

export default function DeviceDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { managerAddress } = useParams();
  const dispatch = useAppDispatch();
  const userGuardianList = useGuardianList();
  const { deviceList } = useDeviceList();
  const { walletInfo } = useCurrentWallet();
  const device = useMemo(
    () => deviceList.filter((d) => d?.managerAddress === managerAddress)?.[0] || {},
    [deviceList, managerAddress],
  );
  const isCurrent = useMemo(() => {
    if (device.managerAddress) return walletInfo.address === device?.managerAddress;
    return true;
  }, [device, walletInfo]);

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
  }, [dispatch, walletInfo, userGuardianList, navigate, device]);

  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/manage-devices');
  }, [navigate]);

  return (
    <div className="device-detail-frame">
      <div className="title">
        <BackHeader
          title={t('Device Details')}
          leftCallBack={handleBack}
          rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
        />
      </div>
      <div className="content">
        <div className="content-item">
          <div className="item-desc">
            <div className="flex-center icon">
              <CustomSvg type={getDeviceIcon(device.deviceInfo?.deviceType || DeviceType.OTHER)} />
            </div>
            <div className="name">{device.deviceInfo?.deviceName}</div>
            {walletInfo.address === device.managerAddress && <div className="flex-center tag">{t('Current')}</div>}
          </div>
          <div className="item-time">
            {device.transactionTime && <div className="time">{dateFormat(device.transactionTime)}</div>}
          </div>
        </div>
        {!isCurrent && (
          <div>
            <div className="content-desc">
              {t(
                'Your account is logged in on this device and you can remove it to revoke its access to your account. Please note that after removing this device, you will need to verify your identity through your guardians when you log in again.',
              )}
            </div>
            <div className="content-btn">
              <Button type="primary" htmlType="submit" onClick={handleDelete}>
                {t('Remove Device')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
