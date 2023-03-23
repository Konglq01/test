import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import SetNewPinForm from 'pages/AccountSetting/components/SetNewPinForm';
import { ISetNewPinProps } from '..';

export default function SetNewPinPopup({
  title,
  goBack,
  setPinLabel,
  confirmPinLabel,
  btnText,
  onSave,
}: ISetNewPinProps) {
  return (
    <div className="set-new-pin-popup">
      <div className="set-pin-title">
        <BackHeader title={title} leftCallBack={goBack} rightElement={<CustomSvg type="Close2" onClick={goBack} />} />
      </div>
      <SetNewPinForm setPinLabel={setPinLabel} confirmPinLabel={confirmPinLabel} btnText={btnText} onSave={onSave} />
    </div>
  );
}
