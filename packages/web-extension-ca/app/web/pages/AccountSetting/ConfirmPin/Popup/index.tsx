import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import './index.less';
import { IConfirmPinProps } from '..';
import SubmitPinButton from 'pages/AccountSetting/components/SubmitPinButton';
import InputPin from 'pages/AccountSetting/components/InputPin';

export default function ConfirmPinPopup({
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
  const navigate = useNavigate();

  return (
    <div className="confirm-pin-popup">
      <div className="confirm-pin-title">
        <BackHeader
          title={title}
          leftCallBack={goBack}
          rightElement={
            <CustomSvg
              type="Close2"
              onClick={() => {
                navigate('/setting/account-setting');
              }}
            />
          }
        />
      </div>
      <InputPin label={pinLabel} value={pin} placeholder={placeholder} errMsg={errMsg} onChange={onChangePin} />
      <SubmitPinButton text={btnText} disable={submitDisable} onClick={handleNext} className="confirm-pin-btn" />
    </div>
  );
}
