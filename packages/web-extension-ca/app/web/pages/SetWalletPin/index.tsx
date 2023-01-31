import { Button, Form, message } from 'antd';
import { FormItem } from 'components/BaseAntd';
import ConfirmPassword from 'components/ConfirmPassword';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useGuardiansInfo, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { useCurrentWallet, useFetchWalletCAAddress } from '@portkey/hooks/hooks-ca/wallet';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import { createWallet, setCAInfo, setManagerInfo } from '@portkey/store/store-ca/wallet/actions';
import useLocationState from 'hooks/useLocationState';
import { useTranslation } from 'react-i18next';
import { recoveryDIDWallet, registerDIDWallet } from '@portkey/api/api-did/apiUtils/wallet';
import { useCurrentApiUrl, useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { VerificationType } from '@portkey/types/verifier';
import { isWalletError } from '@portkey/store/wallet/utils';
import { useHardwareBack } from 'hooks/useHardwareBack';
import CommonModal from 'components/CommonModal';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import AElf from 'aelf-sdk';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import './index.less';
import { randomId } from '@portkey/utils';

export default function SetWalletPin() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { state, pathname } = useLocationState<'login' | 'register' | 'scan'>();
  // const { state } = useLocation();
  const currentNetwork = useCurrentNetworkInfo();

  console.log(state, 'state====');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const [returnOpen, setReturnOpen] = useState<boolean>();
  const baseUrl = useCurrentApiUrl();
  const { scanWalletInfo, scanCaWalletInfo, loginAccount, registerVerifier } = useLoginInfo();
  const fetchWalletResult = useFetchWalletCAAddress();

  const { userGuardianStatus } = useGuardiansInfo();
  console.log(walletInfo, 'walletInfo===');
  const requestRegisterDIDWallet = useCallback(
    async ({ managerAddress }: { managerAddress: string }) => {
      console.log(loginAccount, 'requestRegisterDIDWallet==');
      if (!loginAccount?.guardianAccount || !LoginStrType[loginAccount.loginType])
        throw 'Missing account!!! Please login/register again';
      const requestId = randomId();
      if (!registerVerifier) throw 'Missing Verifier Server';
      const result = await registerDIDWallet({
        baseUrl: currentNetwork.apiUrl,
        type: LoginStrType[loginAccount.loginType],
        loginGuardianAccount: loginAccount.guardianAccount,
        managerAddress,
        deviceString: Date.now().toString(), //navigator.userAgent,
        chainId: DefaultChainId,
        verifierId: registerVerifier.verifierId,
        verificationDoc: registerVerifier.verificationDoc,
        signature: registerVerifier.signature,
        context: {
          clientId: managerAddress,
          requestId: requestId,
        },
      });
      return {
        requestId,
        sessionId: result.sessionId,
      };
    },
    [currentNetwork.apiUrl, loginAccount, registerVerifier],
  );

  const getGuardiansApproved = useCallback(() => {
    return Object.values(userGuardianStatus ?? {}).map((guardian) => ({
      type: LoginStrType[guardian.guardianType],
      value: guardian.guardianAccount,
      verifierId: guardian.verifier?.id || '',
      verificationDoc: guardian.verificationDoc || '',
      signature: guardian.signature || '',
    }));
  }, [userGuardianStatus]);

  const requestRecoveryDIDWallet = useCallback(
    async ({ managerAddress }: { managerAddress: string }) => {
      if (!loginAccount?.guardianAccount || !LoginStrType[loginAccount.loginType])
        throw 'Missing account!!! Please login/register again';
      if (!registerVerifier) throw 'Missing Verifier Server';
      const guardiansApproved = getGuardiansApproved();
      const requestId = randomId();
      const result = await recoveryDIDWallet({
        baseURL: currentNetwork.apiUrl,
        loginGuardianAccount: loginAccount.guardianAccount,
        managerAddress,
        deviceString: Date.now().toString(), //navigator.userAgent,
        chainId: 'AELF',
        guardiansApproved,
        context: {
          clientId: managerAddress,
          requestId,
        },
      });

      return {
        requestId,
        sessionId: result.sessionId,
      };
    },
    [currentNetwork.apiUrl, loginAccount, registerVerifier, getGuardiansApproved],
  );

  const createByScan = useCallback(
    async (pin: string) => {
      const scanWallet = scanWalletInfo;
      if (!scanWallet?.address || !scanCaWalletInfo) {
        navigate(-1);
        throw 'Wallet information is wrong, please go back to scan the code and try again';
      }
      dispatch(
        createWallet({
          walletInfo: scanWallet,
          pin,
          caInfo: scanCaWalletInfo,
        }),
      );
      await setLocalStorage({
        registerStatus: 'Registered',
      });
      await setPinAction(pin);
      navigate('/register/success', { state });
    },
    [dispatch, navigate, scanCaWalletInfo, scanWalletInfo, state],
  );

  const onCreate = useCallback(
    async (values: any) => {
      try {
        const { pin } = values;
        console.log(state, 'state===');

        if (state === 'scan') return createByScan(pin);
        if (!loginAccount?.guardianAccount || LoginStrType[loginAccount.loginType])
          return message.error('Missing account!!! Please login/register again');
        setLoading(true);
        const _walletInfo = walletInfo.address ? walletInfo : AElf.wallet.createNewWallet();
        console.log(pin, walletInfo.address, 'onCreate==');

        // Step 9
        let sessionInfo = {
          requestId: walletInfo.address,
          sessionId: '',
        };

        if (state === 'register') {
          sessionInfo = await requestRegisterDIDWallet({ managerAddress: _walletInfo.address });
        } else {
          sessionInfo = await requestRecoveryDIDWallet({ managerAddress: _walletInfo.address });
        }

        const managerInfo = {
          managerUniqueId: sessionInfo.sessionId,
          requestId: sessionInfo.requestId,
          loginAccount: loginAccount?.guardianAccount,
          type: loginAccount.loginType,
          verificationType: state === 'login' ? VerificationType.communityRecovery : VerificationType.register,
        };

        !walletInfo.address
          ? dispatch(
              createWallet({
                walletInfo: _walletInfo,
                pin,
                caInfo: { managerInfo },
              }),
            )
          : dispatch(
              setManagerInfo({
                pin,
                managerInfo,
              }),
            );
        await setLocalStorage({
          registerStatus: 'registeredNotGetCaAddress',
        });
        await setPinAction(pin);

        // TODO Step 14 Only get Main Chain caAddress

        // Socket
        const walletResult = await fetchWalletResult({
          baseUrl,
          type: LoginStrType[loginAccount?.loginType],
          verificationType: state === 'login' ? VerificationType.communityRecovery : VerificationType.register,
          loginGuardianType: loginAccount.guardianAccount,
          managerUniqueId: sessionInfo.sessionId,
        });

        if (walletResult.status !== 'pass') {
          await setLocalStorage({
            registerStatus: null,
          });
          throw walletResult?.message || walletResult.status;
        }

        dispatch(
          setCAInfo({
            caInfo: {
              caAddress: walletResult.caAddress,
              caHash: walletResult.caHash,
            },
            pin,
            chainId: 'AELF',
          }),
        );
        await setLocalStorage({
          registerStatus: 'Registered',
        });
        navigate('/register/success', { state });
      } catch (error) {
        setLoading(false);
        console.log(error, 'onCreate');
        const walletError = isWalletError(error);
        const errorString = typeof error === 'string' ? error : 'Something error';
        message.error(walletError || errorString);
      }
      setLoading(false);
    },
    [
      state,
      walletInfo,
      loginAccount,
      baseUrl,
      setLoading,
      createByScan,
      dispatch,
      fetchWalletResult,
      navigate,
      requestRegisterDIDWallet,
      requestRecoveryDIDWallet,
    ],
  );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.error(errorInfo, 'onFinishFailed==');
    message.error('Something error');
  }, []);

  const backHandler = useCallback(async () => {
    switch (state) {
      case 'register':
        navigate('/register/select-verifier');
        break;
      case 'login':
        navigate('/login/guardian-approval');
        break;
      default:
        if (pathname.startsWith('/register')) return navigate('/register/select-verifier');
        navigate(-1);
    }
  }, [navigate, pathname, state]);

  const leftCallBack = useCallback(() => setReturnOpen(true), []);

  // useHardwareBack(() => {
  //   if (state === 'register') {
  //     leftCallBack();
  //     return;
  //   }
  //   backHandler();
  // });

  return (
    <div className="common-page set-pin-wrapper" id="set-pin-wrapper">
      <PortKeyTitle leftElement leftCallBack={leftCallBack} />
      <div className="common-content1 set-pin-content">
        <div className="title">{t('Enter Pin to Protect Your Wallet')}</div>
        <Form
          className="create-wallet-form"
          name="CreateWalletForm"
          form={form}
          requiredMark={false}
          onFinish={onCreate}
          layout="vertical"
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
          <FormItem name="pin" style={{ marginBottom: 16 }}>
            <ConfirmPassword validateFields={form.validateFields} isPasswordLengthTipShow={false} />
          </FormItem>

          <FormItem shouldUpdate>
            {() => (
              <Button
                className="submit-btn"
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length
                }>
                {t('Confirm')}
              </Button>
            )}
          </FormItem>
        </Form>
      </div>

      <CommonModal
        closable={false}
        open={returnOpen}
        className="set-pin-modal"
        title={' Confirm return'}
        getContainer={'#set-pin-wrapper'}>
        <p className="modal-content">
          After returning, you will need to re-select the operator and re-do the code verification.
        </p>
        <div className="btn-wrapper">
          <Button onClick={() => setReturnOpen(false)}>No</Button>
          <Button type="primary" onClick={backHandler}>
            Yes
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
