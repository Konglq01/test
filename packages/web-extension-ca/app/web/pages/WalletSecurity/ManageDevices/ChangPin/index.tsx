import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import DeviceLists from '../components/DeviceLists';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/wallet';
import ChangeName from '../components/ChangeName';
import './index.less';
import SetNewPin from '../components/SetNewPin';

export enum Stage {
  'SetNewPin',
  'DeviceLists',
  'ChangeName',
}

export default function ChangePin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>(Stage.SetNewPin);
  const [curPin, setCurPin] = useState<string>('');
  const [curDevice, setCurDevice] = useState<DeviceItemType>();

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
      setCurDevice,
      curPin,
      handleNextStage: () => {
        setStage(Stage.ChangeName);
      },
    }),
    [curPin],
  );

  const changeNameProps = useMemo(
    () => ({
      initValue: { name: curDevice?.deviceTypeInfo.name || '' },
      onSave: (name = '') => {
        //
      },
    }),
    [curDevice?.deviceTypeInfo.name],
  );

  const stageObj = useMemo(
    () => ({
      0: {
        title: t('Set New Pin'),
        element: <SetNewPin {...setNewPinProps} />,
        backFn: () => {
          navigate('/setting/wallet-security');
        },
        btnNext: '',
      },
      1: {
        title: t('Devices'),
        element: <DeviceLists {...deviceListsProps} />,
        backFn: () => {
          setStage(Stage.SetNewPin);
        },
        btnNext: '',
      },
      2: {
        title: t('Device Details'),
        element: <ChangeName {...changeNameProps} />,
        backFn: () => {
          setStage(Stage.DeviceLists);
        },
        btnText: '',
      },
    }),
    [changeNameProps, deviceListsProps, navigate, setNewPinProps, t],
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
