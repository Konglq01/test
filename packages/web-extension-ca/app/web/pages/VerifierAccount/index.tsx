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
import { setOpGuardianAction, setUserGuardianItemStatus } from '@portkey/store/store-ca/guardians/actions';
import { VerificationType, VerifyStatus } from '@portkey/types/verifier';
import './index.less';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import clsx from 'clsx';
import SettingHeader from 'pages/components/SettingHeader';
import useLocationState from 'hooks/useLocationState';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import { GuardianMth } from 'types/guardians';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { setGuardianCountAction } from 'store/reducers/loginCache/actions';
import { sleep } from '@portkey/utils';
import { getAelfInstance } from '@portkey/utils/aelf';
import { getTxResult } from 'utils/aelfUtils';

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
  const verificationType = useMemo(() => {
    switch (state) {
      case 'register':
        return VerificationType.register;
      case 'login':
        return VerificationType.communityRecovery;
      case 'guardians/add':
      case 'guardians/edit':
      case 'guardians/del':
      case 'guardians/setLoginAccount':
        return VerificationType.addGuardian;
      default:
        message.error('Router state error', 2000, () => navigate(-1));
        return 0;
    }
  }, [navigate, state]);

  console.log(state, 'location==');

  const onSuccessInGuardian = useCallback(
    async (res: Record<string, string>) => {
      if (state === 'guardians/setLoginAccount') {
        try {
          setLoading(true);
          const res = await getPrivateKeyAndMnemonic(
            {
              AESEncryptPrivateKey: walletInfo.AESEncryptPrivateKey,
            },
            passwordSeed,
          );
          if (!currentChain?.endPoint || !res?.privateKey) return message.error('set login account error');
          const result = await handleGuardian({
            rpcUrl: currentChain.endPoint,
            chainType: currentNetwork.walletType,
            address: currentChain.caContractAddress,
            privateKey: res.privateKey,
            paramsOption: {
              method: GuardianMth.SetGuardianTypeForLogin,
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
          await getTxResult(aelfInstance, TransactionId);
          opGuardian &&
            dispatch(
              setOpGuardianAction({
                ...opGuardian,
                isLoginAccount: true,
              }),
            );
          setLoading(false);
          navigate('/setting/guardians/view');
        } catch (error: any) {
          setLoading(false);
          message.error(error?.Error?.Message || error.message?.Message || error?.message);
          console.log('---set login account error', error);
        }
      } else {
        if (!currentGuardian) return;
        dispatch(
          setUserGuardianItemStatus({
            key: currentGuardian.key,
            status: VerifyStatus.Verified,
            signature: res.signature,
            verificationDoc: res.verifierDoc,
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
      walletInfo?.AELF?.caHash,
      walletInfo.AESEncryptPrivateKey,
    ],
  );

  const onSuccess = useCallback(
    async (res: Record<string, string>) => {
      if (state === 'register') {
        dispatch(setGuardianCountAction(1));
        navigate('/register/set-pin', { state: 'register' });
      } else if (state == 'login') {
        if (!currentGuardian) return;
        dispatch(
          setUserGuardianItemStatus({
            key: currentGuardian.key,
            status: VerifyStatus.Verified,
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
          verificationType={verificationType}
          guardiansType={loginAccount?.accountLoginType}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
