import { useNavigate } from 'react-router';
import VerifierPage from 'pages/components/VerifierPage';
import { useAppDispatch, useLoginInfo, useGuardiansInfo, useCommonState } from 'store/Provider/hooks';
import { useCallback, useMemo } from 'react';
import { message } from 'antd';
import { setUserGuardianItemStatus } from '@portkey/store/store-ca/guardians/actions';
import { VerificationType, VerifyStatus } from '@portkey/types/verifier';
import './index.less';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import clsx from 'clsx';
import SettingHeader from 'pages/components/SettingHeader';
import useLocationState from 'hooks/useLocationState';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { setGuardianTypeForLogin } from 'utils/sandboxUtil/setLoginAccount';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';

export default function VerifierAccount() {
  const { loginAccount } = useLoginInfo();
  const { currentGuardian, userGuardianStatus } = useGuardiansInfo();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state } = useLocationState<
    'register' | 'login' | 'guardians/add' | 'guardians/edit' | 'guardians/setLoginAccount'
  >();
  const { isPrompt } = useCommonState();
  const { walletInfo } = useCurrentWallet();
  console.log(userGuardianStatus, 'userGuardianStatus===');
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();
  const verificationType = useMemo(() => {
    switch (state) {
      case 'register':
        return VerificationType.register;
      case 'login':
        return VerificationType.communityRecovery;
      case 'guardians/add':
      case 'guardians/edit':
        return VerificationType.addGuardian;
      default:
        message.error('Router state error', 2000, () => navigate(-1));
        return 0;
    }
  }, [navigate, state]);

  console.log(state, 'location==');

  const onSuccess = useCallback(
    async (res: Record<string, string>) => {
      if (state === 'register') {
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
      } else if (state === 'guardians/setLoginAccount') {
        const res = await getPrivateKeyAndMnemonic(
          {
            AESEncryptPrivateKey: walletInfo.AESEncryptPrivateKey,
          },
          '11111111',
        );
        if (!currentChain?.endPoint || !res?.privateKey) return message.error('error');
        const seed = await setGuardianTypeForLogin({
          rpcUrl: currentChain.endPoint,
          chainType: currentNetwork.walletType,
          address: currentChain.caContractAddress,
          privateKey: res.privateKey,
          paramsOption: [
            {
              caHash: walletInfo?.AELF?.caHash,
              guardianType: {
                type: currentGuardian?.guardiansType,
                guardianType: currentGuardian?.loginGuardianType,
              },
            },
          ],
        });
        console.log('------------setGuardianTypeForLogin------------', seed);
        dispatch(resetLoginInfoAction());
        navigate('/setting/guardians');
      } else if (state?.indexOf('guardians') !== -1) {
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
      } else {
        message.error('Router state error');
      }
    },
    [
      state,
      navigate,
      currentGuardian,
      dispatch,
      walletInfo.AESEncryptPrivateKey,
      walletInfo?.AELF?.caHash,
      currentChain?.endPoint,
      currentChain?.caContractAddress,
      currentNetwork.walletType,
    ],
  );

  return (
    <div className={clsx('verifier-account-wrapper', isPrompt ? 'common-page' : 'popup-page')}>
      {isPrompt ? (
        <PortKeyTitle
          leftElement
          leftCallBack={() => {
            state === 'register' && navigate('/register/select-verifier');
            state === 'login' && navigate('/login/guardian-approval');
            state?.indexOf('guardians') !== -1 && navigate(`/setting/${state}`, { state: 'back' });
          }}
        />
      ) : (
        <SettingHeader
          leftCallBack={() => {
            state === 'register' && navigate('/register/select-verifier');
            state === 'login' && navigate('/login/guardian-approval');
            state?.indexOf('guardians') !== -1 && navigate(`/setting/${state}`, { state: 'back' });
          }}
        />
      )}
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
