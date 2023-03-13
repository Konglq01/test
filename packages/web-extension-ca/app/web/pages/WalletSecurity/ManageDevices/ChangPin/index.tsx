import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import DeviceLists from '../components/DeviceLists';
import { DeviceItemType, DeviceType } from '@portkey-wallet/types/types-ca/wallet';
import ChangeName from '../components/ChangeName';
import SetNewPin from '../components/SetNewPin';
import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { Button } from 'antd';
import './index.less';
import { useAppDispatch } from 'store/Provider/hooks';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { changePin } from '@portkey-wallet/store/store-ca/wallet/actions';
import { setPinAction } from 'utils/lib/serviceWorkerAction';

export enum Stage {
  'SetNewPin',
  'DeviceLists',
  'ChangeName',
}

export default function ChangePin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const deviceList = useDeviceList();
  const [stage, setStage] = useState<Stage>(Stage.SetNewPin);
  const [curPin, setCurPin] = useState<string>('');
  const [curDevice, setCurDevice] = useState<DeviceItemType>();
  const [curName, setCurName] = useState('');
  const disable = useMemo(() => stage === Stage.ChangeName && !curName, [curName, stage]);
  const dispatch = useAppDispatch();
  const [showDeviceList, setShowDeviceList] = useState<DeviceItemType[]>(deviceList);

  useEffect(() => {
    setCurName(curDevice?.deviceTypeInfo.name || '');
  }, [curDevice?.deviceTypeInfo.name]);

  const setNewPinProps = useMemo(
    () => ({
      setCurPin,
      handleNextStage: () => {
        setStage(Stage.DeviceLists);
      },
    }),
    [],
  );

  const deviceListsProps = useMemo(
    () => ({
      deviceList: showDeviceList,
      setCurDevice,
      handleNextStage: () => {
        setStage(Stage.ChangeName);
      },
    }),
    [showDeviceList],
  );

  const changeNameProps = useMemo(
    () => ({
      curDevice,
      setCurName,
    }),
    [curDevice],
  );

  const handleSave = useCallback(() => {
    const newDeviceList = showDeviceList.map((device) => {
      if (device.managerAddress === curDevice?.managerAddress) {
        return {
          ...device,
          deviceTypeInfo: {
            ...device.deviceTypeInfo,
            name: curName,
          },
        };
      } else {
        return device;
      }
    });
    setShowDeviceList(newDeviceList);
    setStage(Stage.DeviceLists);
  }, [curDevice, curName, showDeviceList]);

  const handleConfirm = useCallback(async () => {
    // change pin
    // dispatch(setPasswordSeed(curPin));
    // dispatch(
    //   changePin({
    //     pin: '',
    //     newPin: curPin,
    //   }),
    // );
    // await setPinAction(curPin);
    // contract
    navigate('/setting/wallet-security/manage-devices');
  }, [navigate]);

  const stageObj = useMemo(
    () => ({
      0: {
        title: t('Set New Pin'),
        element: <SetNewPin {...setNewPinProps} />,
        backFn: () => {
          navigate('/setting/wallet-security');
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        handler: () => {},
        btnText: '',
      },
      1: {
        title: t('Devices'),
        element: <DeviceLists {...deviceListsProps} />,
        backFn: () => {
          setStage(Stage.SetNewPin);
        },
        handler: handleConfirm,
        btnText: 'Confirm',
      },
      2: {
        title: t('Device Details'),
        element: <ChangeName {...changeNameProps} />,
        backFn: () => {
          setStage(Stage.DeviceLists);
        },
        handler: handleSave,
        btnText: 'Save',
      },
    }),
    [changeNameProps, deviceListsProps, handleConfirm, handleSave, navigate, setNewPinProps, t],
  );

  return (
    <div className="set-new-pin-frame">
      <div className="set-new-pin-title">
        <BackHeader
          title={stageObj[stage].title}
          leftCallBack={stageObj[stage].backFn}
          rightElement={<CustomSvg type="Close2" onClick={stageObj[stage].backFn} />}
        />
      </div>
      <div className="set-new-pin-content">{stageObj[stage].element}</div>
      {stage !== Stage.SetNewPin && (
        <div className="set-new-pin-btn">
          <Button className="submit-btn" type="primary" disabled={disable} onClick={stageObj[stage].handler}>
            {stageObj[stage].btnText}
          </Button>
        </div>
      )}
    </div>
  );
}
