import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { dateFormat } from 'utils';
import { useCallback, useState } from 'react';
import { DeviceItemType, DeviceType } from '@portkey-wallet/types/types-ca/wallet';
import { IconType } from 'types/icon';
import './index.less';

const mockDeviceList: DeviceItemType[] = [
  {
    deviceType: DeviceType.mac,
    deviceTypeInfo: {
      icon: 'Aelf',
      name: 'Mac',
    },
    managerAddress: '123',
    loginTime: 123232333,
  },
  {
    deviceType: DeviceType.android,
    deviceTypeInfo: {
      icon: 'Aelf',
      name: 'Android',
    },
    managerAddress: '234',
    loginTime: 123232333,
  },
  {
    deviceType: DeviceType.ios,
    deviceTypeInfo: {
      icon: 'Aelf',
      name: 'IOS',
    },
    managerAddress: '345',
    loginTime: 123232333,
  },
  {
    deviceType: DeviceType.windows,
    deviceTypeInfo: {
      icon: 'Aelf',
      name: 'Windows',
    },
    managerAddress: '456',
    loginTime: 123232333,
  },
];

interface IDeviceListsProps {
  curPin: string;
  setCurDevice: (d: DeviceItemType) => void;
  handleNextStage: () => void;
}

export default function DeviceLists({ setCurDevice, curPin, handleNextStage }: IDeviceListsProps) {
  const { t } = useTranslation();
  // TODO
  // const deviceList = useDeviceList();
  // TODO curPin decrypt device
  const walletInfo = useCurrentWalletInfo();
  const [showDeviceList, setShowDeviceList] = useState<DeviceItemType[]>(mockDeviceList);

  const handleClick = useCallback(
    (item: DeviceItemType) => {
      setCurDevice(item);
      handleNextStage();
    },
    [handleNextStage, setCurDevice],
  );

  return (
    <div className="device-lists-frame">
      <div className="device-content">
        {showDeviceList.map((item) => (
          <div key={item.managerAddress} onClick={() => handleClick(item)}>
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
          </div>
        ))}
      </div>
    </div>
  );
}
