import { Button, Form, message } from 'antd';
import { FormItem } from 'components/BaseAntd';
import ConfirmPassword from 'components/ConfirmPassword';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAppDispatch, useGuardiansInfo, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import { createWallet, setManagerInfo } from '@portkey/store/store-ca/wallet/actions';
import { useTranslation } from 'react-i18next';
import { recoveryDIDWallet, registerDIDWallet } from '@portkey/api/api-did/utils/wallet';
import { VerificationType, VerifyStatus } from '@portkey/types/verifier';
import { isWalletError } from '@portkey/store/wallet/utils';
import { useHardwareBack } from 'hooks/useHardwareBack';
import CommonModal from 'components/CommonModal';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import AElf from 'aelf-sdk';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { randomId } from '@portkey/utils';
import './index.less';
import useFetchDidWallet from 'hooks/useFetchDidWallet';
import { setPasswordSeed } from 'store/reducers/user/slice';

export default function SetWalletPin() {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { type: state } = useParams<{ type: 'login' | 'scan' | 'register' }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const [returnOpen, setReturnOpen] = useState<boolean>();
  const { scanWalletInfo, scanCaWalletInfo, loginAccount, registerVerifier } = useLoginInfo();
  const getWalletCAAddressResult = useFetchDidWallet();

  const { userGuardianStatus } = useGuardiansInfo();
  console.log(walletInfo, state, scanWalletInfo, scanCaWalletInfo, 'walletInfo===caWallet');

  const requestRegisterDIDWallet = useCallback(
    async ({ managerAddress }: { managerAddress: string }) => {
      console.log(loginAccount, registerVerifier, 'requestRegisterDIDWallet==');
      if (!loginAccount?.guardianAccount || !LoginStrType[loginAccount.loginType])
        throw 'Missing account!!! Please login/register again';
      const requestId = randomId();
      if (!registerVerifier) throw 'Missing Verifier Server';
      const result = await registerDIDWallet({
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
    [loginAccount, registerVerifier],
  );

  const getGuardiansApproved = useCallback(() => {
    return Object.values(userGuardianStatus ?? {})
      .filter((guardian) => guardian.status === VerifyStatus.Verified)
      .map((guardian) => ({
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
      const guardiansApproved = getGuardiansApproved();
      const requestId = randomId();
      const result = await recoveryDIDWallet({
        loginGuardianAccount: loginAccount.guardianAccount,
        managerAddress,
        deviceString: Date.now().toString(), //navigator.userAgent,
        chainId: DefaultChainId,
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
    [loginAccount, getGuardiansApproved],
  );

  const createByScan = useCallback(
    async (pin: string) => {
      const scanWallet = scanWalletInfo;
      if (!scanWallet?.address || !scanCaWalletInfo) {
        navigate('/register/start/scan');
        message.error('Wallet information is wrong, please go back to scan the code and try again');
        return;
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
      dispatch(setPasswordSeed(pin));
      await setPinAction(pin);
      navigate(`/success-page/${state}`);
    },
    [dispatch, navigate, scanCaWalletInfo, scanWalletInfo, state],
  );

  const onCreate = useCallback(
    async (values: any) => {
      try {
        const { pin } = values;
        console.log(state, 'state===');

        if (state === 'scan') return createByScan(pin);
        if (!loginAccount?.guardianAccount || !LoginStrType[loginAccount.loginType])
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
        await getWalletCAAddressResult({
          requestId: sessionInfo.requestId,
          clientId: _walletInfo.address,
          verificationType: state === 'login' ? VerificationType.communityRecovery : VerificationType.register,
          managerUniqueId: sessionInfo.sessionId,
          pwd: pin,
          managerAddress: _walletInfo.address,
        });
      } catch (error: any) {
        setLoading(false);
        console.log(error, 'onCreate==error');
        const walletError = isWalletError(error);
        if (walletError) return message.error(walletError);
        if (error?.message || error?.error?.message) return message.error(error?.message || error?.error?.message);
        const errorString = typeof error === 'string' ? error : 'Something error';
        message.error(walletError || errorString);
      }
      setLoading(false);
    },
    [
      setLoading,
      state,
      createByScan,
      loginAccount,
      walletInfo,
      dispatch,
      getWalletCAAddressResult,
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
      case 'scan':
        navigate('/register/start/scan');
        break;
      default:
        navigate(-1);
    }
  }, [navigate, state]);

  const leftCallBack = useCallback(() => {
    if (state === 'register') return setReturnOpen(true);
    backHandler();
  }, [backHandler, state]);

  useHardwareBack(() => {
    if (state === 'register') {
      leftCallBack();
      return;
    }
    backHandler();
  });

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
        title={t('Leave this page?')}
        getContainer={'#set-pin-wrapper'}>
        <p className="modal-content">{t('returnTip')}</p>
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
