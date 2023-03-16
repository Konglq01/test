import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import DeviceDetail from './DeviceDetail';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/device';
import { useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import DeviceLists from './DeviceLists';
import './index.less';

export enum Stage {
  'DeviceLists',
  'DeviceDetails',
}

export default function ManageDevices() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state: manageAddress } = useLocation();
  const [stage, setStage] = useState<Stage>(Stage.DeviceLists);
  const deviceList = useDeviceList();
  const [curDevice, setCurDevice] = useState<DeviceItemType>(deviceList?.[0]);
  const walletInfo = useCurrentWalletInfo();

  useEffect(() => {
    if (manageAddress) {
      const temp = deviceList.filter((d) => d.managerAddress === manageAddress);
      if (temp.length) {
        setCurDevice(temp[0]);
        setStage(Stage.DeviceDetails);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manageAddress]);

  const deviceListsProps = useMemo(
    () => ({
      deviceList,
      setCurDevice,
      handleNextStage: () => {
        setStage(Stage.DeviceDetails);
      },
    }),
    [deviceList],
  );

  const deviceDetailProps = useMemo(
    () => ({
      device: curDevice,
      isCurrent: curDevice?.managerAddress === walletInfo.address,
    }),
    [curDevice, walletInfo],
  );

  const stageObj = useMemo(
    () => ({
      0: {
        title: t('Login Devices'),
        element: <DeviceLists {...deviceListsProps} />,
        backFn: () => {
          navigate('/setting/wallet-security');
        },
      },
      1: {
        title: t('Device Details'),
        element: <DeviceDetail {...deviceDetailProps} />,
        backFn: () => {
          setStage(Stage.DeviceLists);
        },
      },
    }),
    [deviceDetailProps, deviceListsProps, navigate, t],
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
