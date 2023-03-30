import SetNewPinForm from 'pages/AccountSetting/components/SetNewPinForm';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { ISetNewPinProps } from '..';
import './index.less';

export default function SetNewPinPrompt({
  form,
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
      <SetNewPinForm
        form={form}
        setPinLabel={setPinLabel}
        confirmPinLabel={confirmPinLabel}
        btnText={btnText}
        onSave={onSave}
      />
    </div>
  );
}
