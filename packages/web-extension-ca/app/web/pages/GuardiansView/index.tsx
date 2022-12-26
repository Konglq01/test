import { Button, message, Switch } from 'antd';
import CommonModal from 'components/CommonModal';
import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useGuardiansInfo, useLoginInfo } from 'store/Provider/hooks';
import { useCallback, useState } from 'react';
import { sendVerificationCode } from '@portkey/api/apiUtils/verification';
import { VerificationType } from '@portkey/types/verifier';
import { useTranslation } from 'react-i18next';

import './index.less';

enum SwitchFail {
  default = 0,
  openFail = 1,
  closeFail = 2,
}

export default function GuardiansView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginAccount } = useLoginInfo();
  const { currentGuardian, userGuardiansList } = useGuardiansInfo();
  const [tipOpen, setTipOpen] = useState<boolean>(false);
  const [switchFail, setSwitchFail] = useState<SwitchFail>(SwitchFail.default);

  const handleSwitch = async () => {
    if (currentGuardian?.isLoginAccount) {
      let loginAccountNum = 0;
      userGuardiansList?.forEach((item) => {
        if (item.isLoginAccount) loginAccountNum++;
      });
      if (loginAccountNum <= 1) {
        setSwitchFail(SwitchFail.closeFail);
      } else {
        setTipOpen(true);
      }
    } else {
      //TODO: is other login account ?
      setSwitchFail(SwitchFail.openFail);
      // if(true) {
      //   setSwitchFail(SwitchFail.openFail)
      // } else {
      //   setTipOpen(true);
      // }
    }
  };

  const verifyHandler = useCallback(async () => {
    try {
      if (!loginAccount)
        return message.error('User registration information is invalid, please fill in the registration method again');

      const result = await sendVerificationCode({
        loginGuardianType: loginAccount.loginGuardianType,
        guardiansType: loginAccount.accountLoginType || 0,
        baseUrl: '', // TODO
        verificationType: VerificationType.register, // TODO
      });
      if (result) {
        // TODO
        navigate('/setting/guardians/verifier-account', { state: 'guardians' });
      }
    } catch (error) {
      console.log(error, 'verifyHandler');
    }
  }, [loginAccount, navigate]);

  return (
    <div className="guardian-view-frame">
      <div className="guardian-view-title">
        <SettingHeader
          title="Guardians"
          leftCallBack={() => {
            navigate('/setting/guardians');
          }}
          rightElement={
            <CustomSvg
              type="Close2"
              style={{ width: 18, height: 18 }}
              onClick={() => {
                navigate('/setting/guardians');
              }}
            />
          }
        />
      </div>
      <div className="guardian-view-content">
        <div className="input-content">
          <div className="input-item">
            <p className="label">Guardian Type</p>
            <p className="control">{currentGuardian?.loginGuardianType}</p>
          </div>
          <div className="input-item">
            <div className="label">{t('Verifier')}</div>
            <div className="control">
              <CustomSvg type="PortKey" />
              <span>{currentGuardian?.verifier?.name ?? ''}</span>
            </div>
          </div>
        </div>
        <div className="login-content">
          <span className="label">{t('Login account')}</span>
          <span className="value">{t('The login account will be able to log in and control all your assets')}</span>
          <div className="status-wrap">
            <Switch className="login-switch" checked={currentGuardian?.isLoginAccount} onClick={handleSwitch} />
            <span className="status">{currentGuardian?.isLoginAccount ? 'Open' : 'Close'}</span>
          </div>
        </div>
        <div className="btn-wrap">
          <Button
            onClick={() => {
              navigate('/setting/guardians/edit');
            }}
            type="primary">
            {t('Edit')}
          </Button>
        </div>
      </div>
      <CommonModal className="verify-confirm-modal" closable={false} open={tipOpen} onCancel={() => setTipOpen(false)}>
        <p className="modal-content">{`${currentGuardian?.verifier?.name ?? ''} will send a verification code to ${
          currentGuardian?.loginGuardianType
        } to verify your email address.`}</p>
        <div className="btn-wrapper">
          <Button onClick={() => setTipOpen(false)}>{t('Cancel')}</Button>
          <Button type="primary" onClick={verifyHandler}>
            {t('Confirm')}
          </Button>
        </div>
      </CommonModal>
      <CommonModal
        open={!!switchFail}
        closable={false}
        footer={<Button onClick={() => setSwitchFail(SwitchFail.default)}>{t('Cancel')}</Button>}
        title={
          switchFail === SwitchFail.closeFail
            ? t('This guardian is the only Login account and cannot be turn off')
            : t('This account address is already the login account of other wallets and cannot be opened')
        }></CommonModal>
    </div>
  );
}
