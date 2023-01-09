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
import { setCurrentGuardianAction, setUserGuardianItemStatus } from '@portkey/store/store-ca/guardians/actions';
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
import { resetLoginInfoAction, setGuardianCountAction } from 'store/reducers/loginCache/actions';
import { sleep } from '@portkey/utils';
import { getAelfInstance } from '@portkey/utils/aelf';
import { getTxResult } from 'utils/aelfUtils';
import useGuardianList from 'hooks/useGuardianList';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';

export default function VerifierAccount() {
  const { loginAccount } = useLoginInfo();
  const { userGuardianStatus, currentGuardian, opGuardian } = useGuardiansInfo();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userGuardianList = useGuardianList();
  const { state } = useLocationState<
    'register' | 'login' | 'guardians/add' | 'guardians/edit' | 'guardians/del' | 'guardians/setLoginAccount'
  >();
  const { isPrompt } = useCommonState();
  const { walletInfo } = useCurrentWallet();
  console.log(userGuardianStatus, 'userGuardianStatus===');
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
            // '11111111',
          );
          if (!currentChain?.endPoint || !res?.privateKey) return message.error('error');
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
          const validTxId = await getTxResult(aelfInstance, TransactionId);
          dispatch(
            setCurrentGuardianAction({
              ...currentGuardian,
              isLoginAccount: true,
            } as UserGuardianItem),
          );
          setLoading(false);
          navigate('/setting/guardians/view');
        } catch (error: any) {
          setLoading(false);
          message.error(error.Error);
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
    [currentChain, currentGuardian, currentNetwork, dispatch, navigate, passwordSeed, setLoading, state, walletInfo],
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
    } else if (state?.indexOf('guardians') !== -1) {
      if ('guardians/setLoginAccount' === state) {
        navigate('/setting/guardians/view');
      } else if (['guardians/edit', 'guardians/del'].includes(state)) {
        dispatch(setCurrentGuardianAction(opGuardian as UserGuardianItem));
        navigate('/setting/guardians/edit');
      } else {
        navigate(`/setting/${state}`, { state: 'back' });
      }
    } else {
      navigate(-1);
    }
  }, [dispatch, navigate, opGuardian, state]);

  return (
    <div className={clsx('verifier-account-wrapper', isPrompt ? 'common-page' : 'popup-page')}>
      {isPrompt ? <PortKeyTitle leftElement leftCallBack={handleBack} /> : <SettingHeader leftCallBack={handleBack} />}
      <div className="common-content1 verifier-account-content">
        <VerifierPage
          loginAccount={loginAccount}
          currentGuardian={currentGuardian}
          verificationType={verificationType}
          guardiansType={loginAccount?.accountLoginType}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
