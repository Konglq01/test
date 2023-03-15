import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { dateFormat } from 'utils';
import { useCallback } from 'react';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/wallet';
import { IconType } from 'types/icon';

interface IDeviceListsProps {
  deviceList: DeviceItemType[];
  setCurDevice: (d: DeviceItemType) => void;
  handleNextStage: () => void;
}

export default function DeviceLists({ setCurDevice, deviceList, handleNextStage }: IDeviceListsProps) {
  const { t } = useTranslation();
  const walletInfo = useCurrentWalletInfo();

  const handleClick = useCallback(
    (item: DeviceItemType) => {
      setCurDevice(item);
      handleNextStage();
    },
    [handleNextStage, setCurDevice],
  );

  return (
    <div className="device-list">
      <div className="desc">
        {t(
          "You may delete any device from the list, but you'll need to verify your identity through your guardians next time you log in to Portkey from the deleted device.",
        )}
      </div>
      {deviceList.map((item) => (
        <div className="device-item flex" key={item.managerAddress} onClick={() => handleClick(item)}>
          <div className="content-item">
            <div className="item-desc">
              <div className="flex-center icon">
                <CustomSvg type={item.deviceTypeInfo.icon as IconType} />
              </div>
              <div className="name">{item.deviceTypeInfo.name}</div>
              {walletInfo.address === item.managerAddress && <div className="flex-center tag">{t('Current')}</div>}
            </div>
            <div className="item-time">
              {item.loginTime && <div className="time">{dateFormat(item.loginTime)}</div>}
            </div>
          </div>
          <CustomSvg type="LeftArrow" />
        </div>
      ))}
    </div>
  );
}
