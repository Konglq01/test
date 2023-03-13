import { useCallback, useState } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomPassword from 'components/CustomPassword';
import { useNavigate } from 'react-router';
import { Stage } from '../../';

interface IEnterPinProps {
  setStage: (param: Stage) => void;
  setCurPin: (pin: string) => void;
}

export default function EnterPin({ setStage, setCurPin }: IEnterPinProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');

  const handleNext = useCallback(async () => {
    setCurPin(pin);
    setStage(Stage.DeviceLists);
  }, [pin, setCurPin, setStage]);

  const handleInputChange = useCallback((v: string) => {
    setPin(v);
  }, []);

  return (
    <div className="enter-pin">
      <div className="enter-pin-title">
        To protect the privacy and security of your assets You need to enter the pin to decrypt and view the device
        details
      </div>
      <div className="enter-pin-content">
        <div className="label">{t('Enter Pin')}</div>
        <CustomPassword value={pin} placeholder="Enter Pin" onChange={(e) => handleInputChange(e.target.value)} />
      </div>
      <div className="enter-pin-btn">
        <Button className="submit-btn" type="primary" disabled={!pin} onClick={handleNext}>
          {t('Next')}
        </Button>
        <Button
          className="submit-btn"
          type="link"
          onClick={() => {
            navigate('/setting/wallet-security/manage-devices/change-pin');
          }}>
          {t('Forget Pin ?')}
        </Button>
      </div>
    </div>
  );
}
