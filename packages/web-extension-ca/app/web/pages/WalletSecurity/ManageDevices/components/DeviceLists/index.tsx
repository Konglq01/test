import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import svgsList from 'assets/svgs';
import { dateFormat } from 'utils';
import './index.less';
import { useCallback, useState } from 'react';
import { DeviceItemType, DeviceType } from '@portkey-wallet/types/types-ca/wallet';
import ChangeName from '../ChangeName';
import DeviceDetail from '../DeviceDetail';

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

export type CustomSvgName = keyof typeof svgsList;

export default function DeviceLists() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // TODO
  // const deviceList = useDeviceList();
  const walletInfo = useCurrentWalletInfo();
  const [open, setOpen] = useState(false);
  const [showDeviceList, setShowDeviceList] = useState<DeviceItemType[]>(mockDeviceList);
  const [curDevice, setCurDevice] = useState<DeviceItemType>();

  const handleClick = useCallback((item: DeviceItemType) => {
    setCurDevice(item);
    setOpen(true);
  }, []);

  const handleSave = useCallback(
    (name: string) => {
      const temp = showDeviceList.map((item) => {
        if (item.managerAddress === curDevice?.managerAddress) {
          return {
            ...item,
            deviceTypeInfo: {
              icon: item.deviceTypeInfo.icon,
              name,
            },
          };
        } else {
          return item;
        }
      });
      setShowDeviceList(temp);
      setOpen(false);
    },
    [curDevice, showDeviceList],
  );

  return (
    <div className="device-lists-frame">
      <div className="device-content">
        {showDeviceList.map((item) => (
          <div key={item.managerAddress} onClick={() => handleClick(item)}>
            <div className="content-item">
              <div className="item-desc">
                <div className="flex-center icon">
                  <CustomSvg type={item.deviceTypeInfo.icon as CustomSvgName} />
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
      <ChangeName
        onSave={handleSave}
        initValue={{ name: curDevice?.deviceTypeInfo.name || '' }}
        open={open}
        setOpen={setOpen}
      />
      <DeviceDetail initValue={{ name: curDevice?.deviceTypeInfo.name || '' }} open={open} setOpen={setOpen} />
    </div>
  );
}
