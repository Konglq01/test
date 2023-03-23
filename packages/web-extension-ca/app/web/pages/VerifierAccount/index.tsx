import { useNavigate } from 'react-router';
import VerifierPage from 'pages/components/VerifierPage';
import {
  useAppDispatch,
  useLoginInfo,
  useGuardiansInfo,
  useCommonState,
  useUserInfo,
  useLoading,
} from 'store/Provider/hooks';
import { useCallback, useMemo } from 'react';
import { message } from 'antd';
import { setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import './index.less';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import clsx from 'clsx';
import SettingHeader from 'pages/components/SettingHeader';
import useLocationState from 'hooks/useLocationState';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import { GuardianMth } from 'types/guardians';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { setRegisterVerifierAction } from 'store/reducers/loginCache/actions';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import aes from '@portkey-wallet/utils/aes';
import { handleVerificationDoc } from '@portkey-wallet/utils/guardian';
import useGuardianList from 'hooks/useGuardianList';

export default function VerifierAccount() {
  const { loginAccount } = useLoginInfo();
  const { userGuardianStatus, currentGuardian, opGuardian } = useGuardiansInfo();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state } = useLocationState<
    'register' | 'login' | 'guardians/add' | 'guardians/edit' | 'guardians/del' | 'guardians/setLoginAccount'
  >();
  const { isPrompt } = useCommonState();
  const { walletInfo } = useCurrentWallet();
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();
  const { setLoading } = useLoading();
  const { passwordSeed } = useUserInfo();
  const getGuardianList = useGuardianList();

  const onSuccessInGuardian = useCallback(
    async (res: VerifierInfo) => {
      if (state === 'guardians/setLoginAccount') {
        try {
          setLoading(true);
          const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
          if (!currentChain?.endPoint || !privateKey) return message.error('set login account error');
          const result = await handleGuardian({
            rpcUrl: currentChain.endPoint,
            chainType: currentNetwork.walletType,
            address: currentChain.caContractAddress,
            privateKey,
            paramsOption: {
              method: GuardianMth.SetGuardianTypeForLogin,
              params: {
                caHash: walletInfo?.AELF?.caHash,
                guardian: {
                  type: currentGuardian?.guardianType,
                  verifierId: currentGuardian?.verifier?.id,
                  identifierHash: currentGuardian?.identifierHash,
                  salt: currentGuardian?.salt,
                  value: currentGuardian?.guardianAccount,
                  isLoginGuardian: false,
                },
              },
            },
          });
          console.log('setLoginAccount', result);
          getGuardianList({ caHash: walletInfo.caHash });
          setLoading(false);
          navigate('/setting/guardians/view');
        } catch (error: any) {
          setLoading(false);
          message.error(contractErrorHandler(error));
          console.log('---set login account error', error);
        }
      } else {
        if (!currentGuardian) return;
        const { guardianIdentifier } = handleVerificationDoc(res.verificationDoc);
        dispatch(
          setUserGuardianItemStatus({
            key: currentGuardian.key,
            status: VerifyStatus.Verified,
            signature: res.signature,
            verificationDoc: res.verificationDoc,
            identifierHash: guardianIdentifier,
          }),
        );
        navigate('/setting/guardians/guardian-approval', { state: state });
      }
    },
    [
      currentChain,
      currentGuardian,
      currentNetwork.walletType,
      dispatch,
      navigate,
      opGuardian,
      passwordSeed,
      setLoading,
      state,
      walletInfo,
    ],
  );

  const onSuccess = useCallback(
    async (res: VerifierInfo) => {
      if (state === 'register') {
        dispatch(setRegisterVerifierAction(res));
        navigate('/login/set-pin/register');
      } else if (state == 'login') {
        if (!currentGuardian) return;
        dispatch(
          setUserGuardianItemStatus({
            key: currentGuardian.key,
            status: VerifyStatus.Verified,
            signature: res.signature,
            verificationDoc: res.verificationDoc,
          }),
        );
        navigate('/login/guardian-approval');
      } else if (state?.indexOf('guardians') !== -1) {
        onSuccessInGuardian(res);
        message.success('Verified Successful');
      } else {
        message.error('Router state error');
      }
    },
    [state, navigate, currentGuardian, dispatch, onSuccessInGuardian],
  );

  const handleBack = useCallback(() => {
    if (state === 'register') {
      navigate('/register/select-verifier');
    } else if (state === 'login') {
      navigate('/login/guardian-approval');
    } else if (state === 'guardians/add' && !userGuardianStatus?.[opGuardian?.key || ''].signature) {
      navigate('/setting/guardians/add', { state: 'back' });
    } else if (state === 'guardians/setLoginAccount') {
      navigate('/setting/guardians/view');
    } else if (state.indexOf('guardians') !== -1) {
      navigate('/setting/guardians/guardian-approval', { state: state });
    } else {
      navigate(-1);
    }
  }, [navigate, opGuardian?.key, state, userGuardianStatus]);

  const isInitStatus = useMemo(() => {
    if (state === 'register') return true;
    return !!currentGuardian?.isInitStatus;
  }, [currentGuardian, state]);

  return (
    <div className={clsx('verifier-account-wrapper', isPrompt ? 'common-page' : 'popup-page')}>
      {isPrompt ? <PortKeyTitle leftElement leftCallBack={handleBack} /> : <SettingHeader leftCallBack={handleBack} />}
      <div className="common-content1 verifier-account-content">
        <VerifierPage
          loginAccount={loginAccount}
          isInitStatus={isInitStatus}
          currentGuardian={currentGuardian}
          guardianType={loginAccount?.loginType}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
