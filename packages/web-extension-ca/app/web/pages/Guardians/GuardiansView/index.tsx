import { Button, message, Switch } from 'antd';
import CommonModal from 'components/CommonModal';
import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useAppDispatch, useGuardiansInfo, useLoading, useUserInfo } from 'store/Provider/hooks';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import './index.less';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import {
  setCurrentGuardianAction,
  setOpGuardianAction,
  setPreGuardianAction,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { GuardianMth } from 'types/guardians';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import useGuardianList from 'hooks/useGuardianList';
import { verification } from 'utils/api';
import aes from '@portkey-wallet/utils/aes';

enum SwitchFail {
  default = 0,
  openFail = 1,
  closeFail = 2,
}

export default function GuardiansView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getGuardianList = useGuardianList();
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

  useEffect(() => {
    getGuardianList({ caHash: walletInfo.caHash });
  }, [getGuardianList, walletInfo.caHash]);

  const verifyHandler = useCallback(async () => {
    try {
      if (opGuardian?.isLoginAccount) {
        const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
        if (!currentChain?.endPoint || !privateKey) return message.error('unset login account error');
        setLoading(true);
        const result = await handleGuardian({
          rpcUrl: currentChain.endPoint,
          chainType: currentNetwork.walletType,
          address: currentChain.caContractAddress,
          privateKey: privateKey,
          paramsOption: {
            method: GuardianMth.UnsetGuardianTypeForLogin,
            params: {
              caHash: walletInfo?.AELF?.caHash,
              guardian: {
                type: currentGuardian?.guardianType,
                verifierId: currentGuardian?.verifier?.id,
                identifierHash: currentGuardian?.identifierHash,
                salt: currentGuardian?.salt,
                value: currentGuardian?.guardianAccount,
                isLoginGuardian: true,
              },
            },
          },
        });
        console.log('unSetLoginAccount', result);
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

        const result = await verification.sendVerificationCode({
          params: {
            guardianIdentifier: opGuardian?.guardianAccount as string,
            type: LoginType[opGuardian?.guardianType as LoginType],
            verifierId: opGuardian?.verifier?.id || '',
            chainId: DefaultChainId,
          },
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(
            setCurrentGuardianAction({
              isLoginAccount: opGuardian?.isLoginAccount,
              verifier: opGuardian?.verifier,
              guardianAccount: opGuardian?.guardianAccount as string,
              guardianType: opGuardian?.guardianType as LoginType,
              verifierInfo: {
                sessionId: result.verifierSessionId,
                endPoint: result.endPoint,
              },
              key: opGuardian?.key as string,
              isInitStatus: true,
              identifierHash: opGuardian?.identifierHash as string,
              salt: opGuardian?.salt as string,
            }),
          );
          navigate('/setting/guardians/verifier-account', { state: 'guardians/setLoginAccount' });
        }
      }
    } catch (error: any) {
      setLoading(false);
      message.error(contractErrorHandler(error?.error || error) || error?.type);
      console.log('---setLoginAccount-error---', error);
    }
  }, [
    currentChain,
    currentGuardian,
    currentNetwork,
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
        const isLogin = Object.values(userGuardiansList ?? {}).some(
          (item: UserGuardianItem) => item.isLoginAccount && item.guardianAccount === currentGuardian?.guardianAccount,
        );
        if (isLogin) {
          setTipOpen(true);
          return;
        }
        try {
          await getHolderInfo({
            rpcUrl: currentChain?.endPoint as string,
            address: currentChain?.caContractAddress as string,
            chainType: currentNetwork.walletType,
            paramsOption: {
              guardianIdentifier: opGuardian?.guardianAccount,
            },
          });
          setSwitchFail(SwitchFail.openFail);
        } catch (error: any) {
          if (error?.error?.code?.toString() === '3002') {
            setTipOpen(true);
          } else {
            const _err = error?.error?.message || 'GetHolderInfo error';
            message.error(_err);
            throw _err;
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
      currentChain,
      currentGuardian?.guardianAccount,
      currentNetwork.walletType,
      opGuardian,
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
            {t('Edit')}
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
