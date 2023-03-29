import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { dateFormat } from 'utils';
import { useCallback, useEffect } from 'react';
import { DeviceItemType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import { useLocation, useNavigate } from 'react-router';
import { getDeviceIcon } from 'utils/device';
import BackHeader from 'components/BackHeader';
import { sleep } from '@portkey-wallet/utils';
import { useLoading } from 'store/Provider/hooks';
import './index.less';

export default function DeviceLists() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { deviceList, refetch } = useDeviceList();
  const { setLoading } = useLoading();
  const walletInfo = useCurrentWalletInfo();

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    await sleep(2000);
    setLoading(false);
    refetch();
  }, [refetch, setLoading]);

  useEffect(() => {
    if (state === 'update') {
      handleRefresh();
    }
  }, [handleRefresh, refetch, state]);

  const handleClick = useCallback(
    (item: DeviceItemType) => {
      navigate(`/setting/wallet-security/manage-devices/${item.managerAddress}`);
    },
    [navigate],
  );

  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security');
  }, [navigate]);

  return (
    <div className="device-list-frame">
      <div className="title">
        <BackHeader
          title={t('Login Devices')}
          leftCallBack={handleBack}
          rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
        />
      </div>
      <div className="content">
        <div className="desc">
          {t(
            'You can manage your login devices and remove any device. Please note that when you log in again on a removed device, you will need to verify your identity through your guardians.',
          )}
        </div>
        {deviceList.map((item) => (
          <div className="device-item flex" key={item.managerAddress} onClick={() => handleClick(item)}>
            <div className="content-item">
              <div className="item-desc">
                <div className="flex-center icon">
                  <CustomSvg type={getDeviceIcon(item.deviceInfo.deviceType || DeviceType.OTHER)} />
                </div>
                <div className="name">{item.deviceInfo.deviceName}</div>
                {walletInfo.address === item.managerAddress && <div className="flex-center tag">{t('Current')}</div>}
              </div>
              <div className="item-time">
                {item.transactionTime && <div className="time">{dateFormat(item.transactionTime)}</div>}
              </div>
            </div>
            <CustomSvg type="LeftArrow" />
          </div>
        ))}
      </div>
    </div>
  );
}
