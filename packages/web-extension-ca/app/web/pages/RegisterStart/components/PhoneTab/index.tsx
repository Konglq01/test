import { Button } from 'antd';
import PhoneNumberInput from 'components/PhoneNumberInput';
import { useState } from 'react';
import { useAppDispatch, useLoginInfo } from 'store/Provider/hooks';
import { setCountryCodeAction } from 'store/reducers/loginCache/actions';
import './index.less';

interface PhoneTabProps {
  onFinish?: (phoneNumber: { code: string; phoneNumber: string }) => void;
}

export default function PhoneTab({ onFinish }: PhoneTabProps) {
  const { countryCode } = useLoginInfo();

  const dispatch = useAppDispatch();

  const [phoneNumber, setPhoneNumber] = useState<string>('');

  return (
    <div className="phone-tab-wrapper">
      <PhoneNumberInput
        area={countryCode}
        phoneNumber={phoneNumber}
        onAreaChange={(v) => {
          dispatch(setCountryCodeAction(v));
        }}
        onPhoneNumberChange={(v) => {
          setPhoneNumber(v);
        }}
      />

      <Button
        disabled={!phoneNumber}
        className="login-btn"
        type="primary"
        onClick={() => {
          onFinish?.({
            code: countryCode.country.code,
            phoneNumber,
          });
        }}>
        Login
      </Button>
    </div>
  );
}
