import { Button } from 'antd';
import CustomPassword from 'components/CustomPassword';
import InputPin from 'pages/AccountSetting/components/InputPin';
import SubmitPinButton from 'pages/AccountSetting/components/SubmitPinButton';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IConfirmPinProps } from '..';
import './index.less';

export default function ConfirmPinPrompt({
  title,
  pinLabel,
  pin,
  placeholder,
  errMsg,
  submitDisable,
  btnText,
  onChangePin,
  handleNext,
  goBack,
}: IConfirmPinProps) {
  return (
    <div className="confirm-pin-prompt">
      <SecondPageHeader title={title} leftCallBack={goBack} />
      <InputPin label={pinLabel} value={pin} placeholder={placeholder} errMsg={errMsg} onChange={onChangePin} />
      <SubmitPinButton text={btnText} disable={submitDisable} onClick={handleNext} className="confirm-pin-btn" />
    </div>
  );
}
