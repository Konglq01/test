import SetNewPinForm from 'pages/AccountSetting/components/SetNewPinForm';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { ISetNewPinProps } from '..';

export default function SetNewPinPrompt({
  title,
  goBack,
  setPinLabel,
  confirmPinLabel,
  btnText,
  onSave,
}: ISetNewPinProps) {
  return (
    <div className="set-new-pin-prompt">
      <SecondPageHeader title={title} leftCallBack={goBack} />
      <SetNewPinForm setPinLabel={setPinLabel} confirmPinLabel={confirmPinLabel} btnText={btnText} onSave={onSave} />
    </div>
  );
}
