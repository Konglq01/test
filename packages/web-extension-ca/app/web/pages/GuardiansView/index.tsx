import { Button, message, Switch } from 'antd';
import CommonModal from 'components/CommonModal';
import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useAppDispatch, useGuardiansInfo, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { useState } from 'react';
import { sendVerificationCode } from '@portkey/api/apiUtils/verification';
import { VerificationType } from '@portkey/types/verifier';
import { useTranslation } from 'react-i18next';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import './index.less';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { resetLoginInfoAction, setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { resetUserGuardianStatus, setCurrentGuardianAction } from '@portkey/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import { GuardianMth } from 'types/guardians';

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
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const userGuardianList = useGuardianList();
  const { walletInfo } = useCurrentWallet();

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
      const checkResult = await getHolderInfo({
        rpcUrl: currentChain?.endPoint as string,
        address: currentChain?.caContractAddress as string,
        chainType: currentNetwork.walletType,
        paramsOption: {
          loginGuardianType: currentGuardian?.loginGuardianType as string,
        },
      });
      if (checkResult.result.guardiansInfo?.guardians?.length > 0) {
        setSwitchFail(SwitchFail.openFail);
      } else {
        setTipOpen(true);
      }
    }
  };

  const verifyHandler = async () => {
    try {
      if (!loginAccount)
        return message.error('User registration information is invalid, please fill in the registration method again');
      if (currentGuardian?.isLoginAccount) {
        const res = await getPrivateKeyAndMnemonic(
          {
            AESEncryptPrivateKey: walletInfo.AESEncryptPrivateKey,
          },
          '11111111',
        );
        if (!currentChain?.endPoint || !res?.privateKey) return message.error('error');
        const seed = await handleGuardian({
          rpcUrl: currentChain.endPoint,
          chainType: currentNetwork.walletType,
          address: currentChain.caContractAddress,
          privateKey: res.privateKey,
          paramsOption: {
            method: GuardianMth.UnsetGuardianTypeForLogin,
            params: [
              {
                caHash: walletInfo?.AELF?.caHash,
                guardianType: {
                  type: currentGuardian.guardiansType,
                  guardianType: currentGuardian.loginGuardianType,
                },
              },
            ],
          },
        });
        console.log('------------unsetGuardianTypeForLogin------------', seed);
        dispatch(resetLoginInfoAction());
        navigate('/setting/guardians');
      } else {
        dispatch(
          setLoginAccountAction({
            loginGuardianType: currentGuardian?.loginGuardianType as string,
            accountLoginType: LoginType.email,
          }),
        );
        setLoading(true);
        dispatch(resetUserGuardianStatus());
        await userGuardianList(walletInfo.managerInfo?.loginGuardianType as string);
        const result = await sendVerificationCode({
          loginGuardianType: currentGuardian?.loginGuardianType as string,
          guardiansType: currentGuardian?.guardiansType as LoginType,
          verificationType: VerificationType.addGuardian,
          baseUrl: currentGuardian?.verifier?.url || '',
          managerUniqueId: loginAccount?.managerUniqueId as string,
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(
            setCurrentGuardianAction({
              isLoginAccount: true,
              verifier: currentGuardian?.verifier,
              loginGuardianType: currentGuardian?.loginGuardianType as string,
              guardiansType: currentGuardian?.guardiansType as LoginType,
              sessionId: result.verifierSessionId,
              key: currentGuardian?.key as string,
            }),
          );
          navigate('/setting/guardians/verifier-account', { state: 'guardians/setLoginAccount' });
        }
      }
    } catch (error) {
      console.log(error, 'verifyHandler');
    }
  };

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
              <img src={currentGuardian?.verifier?.imageUrl} alt="icon" />
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
        footer={<Button onClick={() => setSwitchFail(SwitchFail.default)}>{t('Close')}</Button>}
        title={
          switchFail === SwitchFail.closeFail
            ? t('This guardian is the only Login account and cannot be turn off')
            : t('This account address is already the login account of other wallets and cannot be opened')
        }></CommonModal>
    </div>
  );
}
