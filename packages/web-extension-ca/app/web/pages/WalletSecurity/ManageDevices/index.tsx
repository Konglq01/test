import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import EnterPin from './components/EnterPin';
import DeviceLists from './components/DeviceLists';
import './index.less';
import DeviceDetail from './components/DeviceDetail';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/wallet';

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

  const enterPinProps = useMemo(
    () => ({
      setStage,
      setCurPin,
    }),
    [],
  );

  const deviceListsProps = useMemo(
    () => ({
      setCurDevice,
      curPin,
      handleNextStage: () => {
        setStage(Stage.DeviceDetails);
      },
    }),
    [curPin],
  );

  const deviceDetailProps = useMemo(
    () => ({
      deviceName: curDevice?.deviceTypeInfo.name || '',
    }),
    [curDevice?.deviceTypeInfo.name],
  );

  const stageObj = useMemo(
    () => ({
      0: {
        title: t('Enter Pin'),
        element: <EnterPin {...enterPinProps} />,
        backFn: () => {
          navigate('/setting/wallet-security');
        },
        btnNext: '',
      },
      1: {
        title: t('Devices'),
        element: <DeviceLists {...deviceListsProps} />,
        backFn: () => {
          setStage(Stage.EnterPin);
        },
        btnNext: '',
      },
      2: {
        title: t('Device Details'),
        element: <DeviceDetail {...deviceDetailProps} />,
        backFn: () => {
          setStage(Stage.DeviceLists);
        },
        btnText: '',
      },
    }),
    [deviceDetailProps, deviceListsProps, enterPinProps, navigate, t],
  );

  return (
    <div className="wallet-security-frame">
      <div className="wallet-security-title">
        <BackHeader
          title={stageObj[stage].title}
          leftCallBack={stageObj[stage].backFn}
          rightElement={<CustomSvg type="Close2" onClick={stageObj[stage].backFn} />}
        />
      </div>
      <div className="menu-list">{stageObj[stage].element}</div>
    </div>
  );
}
