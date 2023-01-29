import { Button, message, Switch } from 'antd';
import CommonModal from 'components/CommonModal';
import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useAppDispatch, useGuardiansInfo, useLoading, useUserInfo } from 'store/Provider/hooks';
import { useState, useMemo, useCallback } from 'react';
import { sendVerificationCode } from '@portkey/api/api-did/apiUtils/verification';
import { useTranslation } from 'react-i18next';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import './index.less';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { LoginType } from '@portkey/types/types-ca/wallet';
import {
  setCurrentGuardianAction,
  setOpGuardianAction,
  setPreGuardianAction,
} from '@portkey/store/store-ca/guardians/actions';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import { GuardianMth } from 'types/guardians';
import { sleep } from '@portkey/utils';
import { getAelfInstance } from '@portkey/utils/aelf';
import { getTxResult } from 'utils/aelfUtils';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { LoginStrType } from '@portkey/store/store-ca/guardians/utils';
// import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';

enum SwitchFail {
  default = 0,
  openFail = 1,
  closeFail = 2,
}

export default function GuardiansView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentGuardian, opGuardian, userGuardiansList } = useGuardiansInfo();
  const [tipOpen, setTipOpen] = useState<boolean>(false);
  const [switchFail, setSwitchFail] = useState<SwitchFail>(SwitchFail.default);
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { passwordSeed } = useUserInfo();
  const editable = useMemo(() => Object.keys(userGuardiansList ?? {}).length > 1, [userGuardiansList]);

  const verifyHandler = useCallback(async () => {
    try {
      if (opGuardian?.isLoginAccount) {
        const res = await getPrivateKeyAndMnemonic(
          {
            AESEncryptPrivateKey: walletInfo.AESEncryptPrivateKey,
          },
          passwordSeed,
        );
        if (!currentChain?.endPoint || !res?.privateKey) return message.error('unset login account error');
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
                  type: currentGuardian?.guardianType,
                  guardianType: currentGuardian?.guardianAccount,
                },
              },
            ],
          },
        });
        const { TransactionId } = result.result.message || result;
        await sleep(1000);
        const aelfInstance = getAelfInstance(currentChain.endPoint);
        await getTxResult(aelfInstance, TransactionId);
        dispatch(
          setOpGuardianAction({
            ...opGuardian,
            isLoginAccount: false,
          }),
        );
        setLoading(false);
        setTipOpen(false);
      } else {
        dispatch(
          setLoginAccountAction({
            guardianAccount: opGuardian?.guardianAccount as string,
            loginType: opGuardian?.guardianType as LoginType,
          }),
        );
        setLoading(true);
        const result = await sendVerificationCode({
          guardianAccount: opGuardian?.guardianAccount as string,
          type: LoginStrType[opGuardian?.guardianType as LoginType],
          baseUrl: opGuardian?.verifier?.url || '',
          id: opGuardian?.verifier?.id || '',
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(
            setCurrentGuardianAction({
              isLoginAccount: opGuardian?.isLoginAccount,
              verifier: opGuardian?.verifier,
              guardianAccount: opGuardian?.guardianAccount as string,
              guardianType: opGuardian?.guardianType as LoginType,
              sessionId: result.verifierSessionId,
              key: opGuardian?.key as string,
              isInitStatus: true,
            }),
          );
          navigate('/setting/guardians/verifier-account', { state: 'guardians/setLoginAccount' });
        }
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error?.Error?.Message || error.message?.Message || error?.message || error?.type);
      console.log('---setLoginAccount-error', error);
    }
  }, [
    currentChain,
    currentGuardian,
    currentNetwork.walletType,
    dispatch,
    navigate,
    opGuardian,
    passwordSeed,
    setLoading,
    walletInfo,
  ]);

  const handleSwitch = useCallback(
    async (status: boolean) => {
      if (status) {
        // TODO: this logic will be added
        // const isLogin = Object.values(userGuardiansList ?? {}).some(
        //   (item: UserGuardianItem) =>
        //     item.isLoginAccount && item.loginGuardianType === currentGuardian?.loginGuardianType,
        // );
        // if (isLogin) {
        //   setTipOpen(true);
        //   return;
        // }
        try {
          await getHolderInfo({
            rpcUrl: currentChain?.endPoint as string,
            address: currentChain?.caContractAddress as string,
            chainType: currentNetwork.walletType,
            paramsOption: {
              loginGuardianAccount: opGuardian?.guardianAccount,
            },
          });
          setSwitchFail(SwitchFail.openFail);
        } catch (error: any) {
          if (error?.Error?.Details && error?.Error?.Details?.indexOf('Not found ca_hash')) {
            setTipOpen(true);
          } else {
            message.error(error?.Error?.Message || error.message?.Message || error?.message);
            throw error;
          }
        }
      } else {
        let loginAccountNum = 0;
        userGuardiansList?.forEach((item) => {
          if (item.isLoginAccount) loginAccountNum++;
        });
        if (loginAccountNum > 1) {
          verifyHandler();
        } else {
          setSwitchFail(SwitchFail.closeFail);
        }
      }
    },
    [
      currentChain?.caContractAddress,
      currentChain?.endPoint,
      currentNetwork.walletType,
      opGuardian?.guardianAccount,
      userGuardiansList,
      verifyHandler,
    ],
  );

  return (
    <div className="guardian-view-frame">
      <div className="guardian-view-title">
        <SettingHeader
          title={t('Guardians')}
          leftCallBack={() => {
            navigate('/setting/guardians');
          }}
          rightElement={
            <CustomSvg
              type="Close2"
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
            <p className="label">{t('Guardian Type')}</p>
            <p className="control">{opGuardian?.guardianAccount}</p>
          </div>
          <div className="input-item">
            <div className="label">{t('Verifier')}</div>
            <div className="control">
              <BaseVerifierIcon width={32} height={32} src={opGuardian?.verifier?.imageUrl} />
              <span className="name">{opGuardian?.verifier?.name ?? ''}</span>
            </div>
          </div>
        </div>
        <div className="login-content">
          <span className="label">{t('Login account')}</span>
          <span className="value">{t('The login account will be able to log in and control all your assets')}</span>
          <div className="status-wrap">
            <Switch className="login-switch" checked={opGuardian?.isLoginAccount} onChange={handleSwitch} />
            <span className="status">{opGuardian?.isLoginAccount ? 'Open' : 'Close'}</span>
          </div>
        </div>
        <div className="btn-wrap" style={{ display: editable ? '' : 'none' }}>
          <Button
            onClick={() => {
              dispatch(setPreGuardianAction(opGuardian));
              navigate('/setting/guardians/edit');
            }}
            type="primary">
            {t('Change Verifier')}
          </Button>
        </div>
      </div>
      <CommonModal className="verify-confirm-modal" closable={false} open={tipOpen} onCancel={() => setTipOpen(false)}>
        <p className="modal-content">{`${opGuardian?.verifier?.name ?? ''} will send a verification code to ${
          opGuardian?.guardianAccount
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
            ? t('This guardian is the only login account and cannot be turned off')
            : t('This account address is already a login account and cannot be used')}
        </p>
        <div className="login-account-btn">
          <Button type="primary" onClick={() => setSwitchFail(SwitchFail.default)}>
            {t('Close')}
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
