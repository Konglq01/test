import { useCallback, useState } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomPassword from 'components/CustomPassword';
import { useNavigate } from 'react-router';
// import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
// import aes from '@portkey-wallet/utils/aes';
import { Stage } from '../../';
import './index.less';

interface IEnterPinProps {
  setStage: (param: Stage) => void;
  setCurPin: (pin: string) => void;
}

export default function EnterPin({ setStage, setCurPin }: IEnterPinProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [disable, setDisable] = useState<boolean>(true);
  const [pin, setPin] = useState('');
  const [errMsg, setErrMsg] = useState('');
  // const walletInfo = useCurrentWalletInfo();

  const handleNext = useCallback(async () => {
    // const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);
    // if (privateKey) {
    //   setErrMsg('');
    //   setDisable(false);
    // } else {
    //   setPin('');
    //   setErrMsg('Incorrect Pin');
    //   setDisable(true);
    // }
    setStage(Stage.DeviceLists);
    setCurPin(pin);
  }, [pin, setCurPin, setStage]);

  const handleInputChange = useCallback((v: string) => {
    setErrMsg('');
    if (!v) {
      setDisable(true);
      setPin('');
    } else {
      setDisable(false);
      setPin(v);
    }
  }, []);

  return (
    <div className="device-set-pin">
      <div className="set-pin-title">
        To protect the privacy and security of your assets You need to enter the pin to decrypt and view the device
        details
      </div>
      <div className="set-pin-content">
        <div className="label">{t('Enter Pin')}</div>
        <CustomPassword value={pin} placeholder="Enter Pin" onChange={(e) => handleInputChange(e.target.value)} />
        <div className="error-msg">{errMsg}</div>
      </div>
      <div className="set-pin-btn">
        <Button className="submit-btn" type="primary" disabled={disable} onClick={handleNext}>
          {t('Next')}
        </Button>
        <Button
          className="submit-btn"
          type="link"
          onClick={() => {
            navigate('/setting/wallet-security/manage-devices/chang-pin');
          }}>
          {t('Forget Pin ?')}
        </Button>
      </div>
    </div>
  );
}
