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
import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
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
import { IconType } from 'types/icon';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { getGoogleUserInfo, parseAppleIdentityToken } from '@portkey-wallet/utils/authentication';
import { request } from '@portkey-wallet/api/api-did';

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
  const isPhoneType = useMemo(() => opGuardian?.guardianType === LoginType.Phone, [opGuardian?.guardianType]);

  useEffect(() => {
    getGuardianList({ caHash: walletInfo.caHash });
  }, [getGuardianList, walletInfo.caHash]);

  useEffect(() => {
    const temp = userGuardiansList?.filter((guardian) => guardian.key === opGuardian?.key) || [];
    if (temp.length > 0) {
      dispatch(setCurrentGuardianAction(temp[0]));
      dispatch(setOpGuardianAction(temp[0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userGuardiansList]);

  const handleSocialVerify = useCallback(
    async (v: ISocialLogin) => {
      const result = await socialLoginAction(v);
      const data = result.data;
      if (!data) throw 'Action error';
      const verifySocialParams = {
        verifierId: opGuardian?.verifier?.id,
        chainId: currentChain?.chainId || DefaultChainId,
        accessToken: data?.access_token,
      };
      if (v === 'Google') {
        const userInfo = await getGoogleUserInfo(data?.access_token);
        setLoading(true);
        // const { firstName, email, id } = userInfo;
        const res = await request.verify.verifyGoogleToken({
          params: verifySocialParams,
        });
      } else if (v === 'Apple') {
        const userInfo = parseAppleIdentityToken(data?.access_token);
        // const { email, userId } = userInfo;
        setLoading(true);
        const res = await request.verify.verifyAppleToken({
          params: verifySocialParams,
        });
      }

      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
      if (!currentChain?.endPoint || !privateKey) return message.error('unset login account error');
      const curRes = await handleGuardian({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey: privateKey,
        paramsOption: {
          method: GuardianMth.SetGuardianTypeForLogin,
          params: {
            caHash: walletInfo?.AELF?.caHash,
            guardian: {
              type: currentGuardian?.guardianType,
              verifierId: currentGuardian?.verifier?.id,
              identifierHash: currentGuardian?.identifierHash,
            },
          },
        },
      });
      console.log('SetLoginAccount', curRes);
      getGuardianList({ caHash: walletInfo.caHash });
      setLoading(false);
      // setTipOpen(false);
    },
    [
      currentChain,
      currentGuardian,
      currentNetwork.walletType,
      getGuardianList,
      opGuardian?.verifier?.id,
      passwordSeed,
      setLoading,
      walletInfo,
    ],
  );

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
              },
            },
          },
        });
        console.log('unSetLoginAccount', result);
        getGuardianList({ caHash: walletInfo.caHash });
        setLoading(false);
        setTipOpen(false);
      } else {
        dispatch(
          setLoginAccountAction({
            guardianAccount: opGuardian?.guardianAccount as string,
            loginType: opGuardian?.guardianType as LoginType,
          }),
        );
        if (LoginType.Apple === opGuardian?.guardianType) {
          handleSocialVerify('Apple');
          return;
        } else if (LoginType.Google === opGuardian?.guardianType) {
          handleSocialVerify('Google');
          return;
        }
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
    currentGuardian?.guardianType,
    currentGuardian?.identifierHash,
    currentGuardian?.verifier?.id,
    currentNetwork.walletType,
    dispatch,
    getGuardianList,
    handleSocialVerify,
    navigate,
    opGuardian?.guardianAccount,
    opGuardian?.guardianType,
    opGuardian?.identifierHash,
    opGuardian?.isLoginAccount,
    opGuardian?.key,
    opGuardian?.salt,
    opGuardian?.verifier,
    passwordSeed,
    setLoading,
    walletInfo?.AELF?.caHash,
    walletInfo.AESEncryptPrivateKey,
    walletInfo.caHash,
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
            if (opGuardian?.guardianType === LoginType.Apple) {
              handleSocialVerify('Apple');
            } else if (opGuardian?.guardianType === LoginType.Google) {
              handleSocialVerify('Google');
            } else {
              setTipOpen(true);
            }
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
    [currentChain, currentGuardian, currentNetwork, handleSocialVerify, opGuardian, userGuardiansList, verifyHandler],
  );

  const accountShow = useMemo(() => {
    switch (opGuardian?.guardianType) {
      case LoginType.Email:
      case LoginType.Phone:
        return <div className="name account">{opGuardian?.guardianAccount}</div>;
      case LoginType.Google:
      case LoginType.Apple:
        return (
          <div className="name account flex-column">
            <span>{opGuardian.firstName || 'name'}</span>
            <span className="account">{opGuardian.isPrivate ? '******' : opGuardian?.thirdPartyEmail}</span>
          </div>
        );
    }
  }, [opGuardian]);

  const getGuardianIcon = useCallback((v: LoginType): IconType => {
    switch (v) {
      case LoginType.Email:
        return 'email';
      case LoginType.Phone:
        return 'GuardianPhone';
      case LoginType.Apple:
        return 'GuardianApple';
      case LoginType.Google:
        return 'GuardianGoogle';
    }
  }, []);

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
            <p className="label">{`Guardian ${LoginType[opGuardian?.guardianType || 0]}`}</p>
            <p className="control">
              <CustomSvg type={getGuardianIcon(opGuardian?.guardianType || 0)} />
              {accountShow}
            </p>
          </div>
          <div className="input-item">
            <div className="label">{t('Verifier')}</div>
            <div className="control">
              <BaseVerifierIcon src={opGuardian?.verifier?.imageUrl} fallback={opGuardian?.verifier?.name[0]} />
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
        <p className="modal-content">
          {`${opGuardian?.verifier?.name ?? ''} will send a verification code to `}
          <span className="bold">{opGuardian?.guardianAccount}</span>
          {` to verify your ${isPhoneType ? 'phone number' : 'email address'}.`}
        </p>
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
