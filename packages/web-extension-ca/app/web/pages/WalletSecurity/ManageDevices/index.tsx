import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import EnterPin from './components/EnterPin';
import DeviceLists from './components/DeviceLists';
import DeviceDetail from './components/DeviceDetail';
import { DeviceItemType, DeviceType } from '@portkey-wallet/types/types-ca/wallet';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import aes from '@portkey-wallet/utils/aes';
import './index.less';

export enum Stage {
  'EnterPin',
  'DeviceLists',
  'DeviceDetails',
}

export default function ManageDevices() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>(Stage.EnterPin);
  const [curPin, setCurPin] = useState<string>('');
  const [curDevice, setCurDevice] = useState<DeviceItemType>();
  const walletInfo = useCurrentWalletInfo();
  const deviceList = useDeviceList();

  const showDeviceList = useMemo(() => {
    return deviceList.map((device) => ({
      ...device,
      deviceTypeInfo: {
        ...device.deviceTypeInfo,
        // TODO
        // name: aes.decrypt(curPin, device.deviceTypeInfo.name),
      },
    }));
  }, [deviceList]);

  const enterPinProps = useMemo(
    () => ({
      setStage,
      setCurPin,
    }),
    [],
  );

  const deviceListsProps = useMemo(
    () => ({
      deviceList: showDeviceList,
      setCurDevice,
      handleNextStage: () => {
        setStage(Stage.DeviceDetails);
      },
    }),
    [showDeviceList],
  );

  const deviceDetailProps = useMemo(
    () => ({
      deviceName: curDevice?.deviceTypeInfo.name || '',
      isCurrent: curDevice?.managerAddress === walletInfo.address,
    }),
    [curDevice, walletInfo],
  );

  const stageObj = useMemo(
    () => ({
      0: {
        title: t('Enter Pin'),
        element: <EnterPin {...enterPinProps} />,
        backFn: () => {
          navigate('/setting/wallet-security');
        },
      },
      1: {
        title: t('Devices'),
        element: <DeviceLists {...deviceListsProps} />,
        backFn: () => {
          setStage(Stage.EnterPin);
        },
      },
      2: {
        title: t('Device Details'),
        element: <DeviceDetail {...deviceDetailProps} />,
        backFn: () => {
          setStage(Stage.DeviceLists);
        },
      },
    }),
    [deviceDetailProps, deviceListsProps, enterPinProps, navigate, t],
  );

  return (
    <div className="device-frame">
      <div className="device-title">
        <BackHeader
          title={stageObj[stage].title}
          leftCallBack={stageObj[stage].backFn}
          rightElement={<CustomSvg type="Close2" onClick={stageObj[stage].backFn} />}
        />
      </div>
      <div className="device-content">{stageObj[stage].element}</div>
    </div>
  );
}
