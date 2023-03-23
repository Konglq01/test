import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import EnterPin from './components/EnterPin';
import SetNewPin from './components/SetNewPin';
import DeviceLists from './components/DeviceLists';
import './index.less';

export enum Stage {
  'EnterPin',
  'DeviceLists',
  'SetNewPin',
}

export default function ManageDevices() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>(Stage.EnterPin);
  const [curPin, setCurPin] = useState<string>('');
  const [isChangePin, setIsChangePin] = useState(false);

  const enterPinProps = useMemo(
    () => ({
      setStage,
      setCurPin,
    }),
    [],
  );

  const obj = useMemo(
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
        element: <DeviceLists />,
        backFn: () => {
          setStage(Stage.EnterPin);
        },
      },
      2: {
        title: t('Set New Pin'),
        element: <SetNewPin />,
        backFn: () => {
          setStage(Stage.EnterPin);
        },
      },
    }),
    [enterPinProps, navigate, t],
  );

  return (
    <div className="wallet-security-frame">
      <div className="wallet-security-title">
        <BackHeader
          title={obj[stage].title}
          leftCallBack={obj[stage].backFn}
          rightElement={<CustomSvg type="Close2" onClick={obj[stage].backFn} />}
        />
      </div>
      <div className="menu-list">{obj[stage].element}</div>
    </div>
  );
}
