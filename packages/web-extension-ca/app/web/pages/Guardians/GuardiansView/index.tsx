import { Button, message, Switch } from 'antd';
import CommonModal from 'components/CommonModal';
import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useAppDispatch, useGuardiansInfo, useLoading, useUserInfo } from 'store/Provider/hooks';
import { useState } from 'react';
import { sendVerificationCode } from '@portkey/api/apiUtils/verification';
import { VerificationType } from '@portkey/types/verifier';
import { useTranslation } from 'react-i18next';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import './index.less';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { resetUserGuardianStatus, setCurrentGuardianAction } from '@portkey/store/store-ca/guardians/actions';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import { GuardianMth } from 'types/guardians';
import { sleep } from '@portkey/utils';
import { getAelfInstance } from '@portkey/utils/aelf';
import { getTxResult } from 'utils/aelfUtils';

enum SwitchFail {
  default = 0,
  openFail = 1,
  closeFail = 2,
}

export default function GuardiansView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentGuardian, userGuardiansList } = useGuardiansInfo();
  const [tipOpen, setTipOpen] = useState<boolean>(false);
  const [switchFail, setSwitchFail] = useState<SwitchFail>(SwitchFail.default);
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { passwordSeed } = useUserInfo();

  const handleSwitch = async () => {
    if (currentGuardian && currentGuardian.isLoginAccount) {
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
          caHash: walletInfo.caHash,
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
      if (currentGuardian?.isLoginAccount) {
        const res = await getPrivateKeyAndMnemonic(
          {
            AESEncryptPrivateKey: walletInfo.AESEncryptPrivateKey,
          },
          passwordSeed,
          // '11111111',
        );
        if (!currentChain?.endPoint || !res?.privateKey) return message.error('error');
        setLoading(true);
        const result = await handleGuardian({
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
                  type: currentGuardian?.guardiansType,
                  guardianType: currentGuardian?.loginGuardianType,
                },
              },
            ],
          },
        });
        const { TransactionId } = result.result.message || result;
        await sleep(1000);
        const aelfInstance = getAelfInstance(currentChain.endPoint);
        try {
          const validTxId = await getTxResult(aelfInstance, TransactionId);
          dispatch(resetUserGuardianStatus());
          dispatch(
            setCurrentGuardianAction({
              ...currentGuardian,
              isLoginAccount: false,
            }),
          );
          setLoading(false);
        } catch (error: any) {
          setLoading(false);
          message.error(error.Error);
        }
      } else {
        dispatch(
          setLoginAccountAction({
            loginGuardianType: currentGuardian?.loginGuardianType as string,
            accountLoginType: LoginType.email,
          }),
        );
        setLoading(true);
        const result = await sendVerificationCode({
          loginGuardianType: currentGuardian?.loginGuardianType as string,
          guardiansType: currentGuardian?.guardiansType as LoginType,
          verificationType: VerificationType.addGuardian,
          baseUrl: currentGuardian?.verifier?.url || '',
          managerUniqueId: walletInfo.managerInfo?.managerUniqueId as string,
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(
            setCurrentGuardianAction({
              isLoginAccount: currentGuardian?.isLoginAccount,
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
      setLoading(false);
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
            <Switch className="login-switch" checked={currentGuardian?.isLoginAccount} onChange={handleSwitch} />
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
      <CommonModal open={!!switchFail} closable={false} className="login-account-tip-modal">
        <p className="modal-content">
          {switchFail === SwitchFail.closeFail
            ? t('This guardian is the only Login account and cannot be turn off')
            : t('This account address is already the login account of other wallets and cannot be opened')}
        </p>
        <div style={{ padding: '15px 16px 17px 16px' }}>
          <Button style={{ borderRadius: 24 }} type="primary" onClick={() => setSwitchFail(SwitchFail.default)}>
            {t('Close')}
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
