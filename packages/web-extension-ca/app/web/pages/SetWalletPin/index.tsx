import { Button, Form, message } from 'antd';
import { FormItem } from 'components/BaseAntd';
import ConfirmPassword from 'components/ConfirmPassword';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { useCurrentWallet, useFetchWalletCAAddress } from '@portkey/hooks/hooks-ca/wallet';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import { createWallet, setCAInfo, setManagerInfo } from '@portkey/store/store-ca/wallet/actions';
import useLocationState from 'hooks/useLocationState';
import { useTranslation } from 'react-i18next';
import { createWalletInfo } from '@portkey/api/apiUtils/wallet';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { VerificationType } from '@portkey/types/verifier';
import { isWalletError } from '@portkey/store/wallet/utils';
import AElf from 'aelf-sdk';
import './index.less';

export default function SetWalletPin() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { state } = useLocationState<'login' | 'register' | 'scan'>();
  // const { state } = useLocation();
  const currentNetwork = useCurrentNetworkInfo();

  console.log(state, 'state====');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { scanWalletInfo, scanCaWalletInfo, loginAccount } = useLoginInfo();
  const fetchWalletResult = useFetchWalletCAAddress();

  console.log(walletInfo, 'walletInfo===');
  const createAndGetSessionId = useCallback(
    async ({ managerAddress }: { managerAddress: string }) => {
      if (!loginAccount?.loginGuardianType || (!loginAccount.accountLoginType && loginAccount.accountLoginType !== 0))
        return message.error('Missing account!!! Please login/register again');
      // const baseUrl
      await createWalletInfo({
        baseUrl: currentNetwork.apiUrl,
        type: loginAccount?.accountLoginType,
        loginGuardianType: loginAccount.loginGuardianType,
        managerUniqueId: loginAccount.managerUniqueId,
        managerAddress,
        chainId: 'AELF',
        verificationType: state === 'login' ? VerificationType.communityRecovery : VerificationType.register,
        deviceString: Date.now().toString(), //navigator.userAgent,
        guardianCount: 1,
      });
      return loginAccount.managerUniqueId;
    },
    [currentNetwork.apiUrl, loginAccount, state],
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
        if (state === 'scan') return createByScan(pin);
        console.log(pin, walletInfo, loginAccount, 'onCreate==');
        if (!loginAccount?.loginGuardianType || (!loginAccount.accountLoginType && loginAccount.accountLoginType !== 0))
          return message.error('Missing account!!! Please login/register again');
        setLoading(true);
        const _walletInfo = walletInfo.address ? walletInfo : AElf.wallet.createNewWallet();
        console.log(pin, walletInfo.address, 'onCreate==');
        // Step 9
        const sessionId = await createAndGetSessionId({ managerAddress: _walletInfo.address });
        const managerInfo = {
          managerUniqueId: loginAccount?.managerUniqueId || sessionId,
          loginGuardianType: loginAccount?.loginGuardianType,
          type: loginAccount.accountLoginType,
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
        const walletResult = await fetchWalletResult({
          baseUrl: currentNetwork.apiUrl,
          type: loginAccount?.accountLoginType,
          verificationType: state === 'login' ? VerificationType.communityRecovery : VerificationType.register,
          loginGuardianType: loginAccount.loginGuardianType,
          managerUniqueId: loginAccount.managerUniqueId,
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
      currentNetwork.apiUrl,
      navigate,
      dispatch,
      setLoading,
      createByScan,
      fetchWalletResult,
      createAndGetSessionId,
    ],
  );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.error(errorInfo, 'onFinishFailed==');
    message.error('Something error');
  }, []);

  const backHandler = useCallback(async () => {
    if (state === 'register') {
      navigate('/register/select-verifier');
    } else if (state === 'login') {
      navigate('/login/guardian-approval');
    }
  }, [navigate, state]);

  return (
    <div className="common-page set-pin-wrapper" id="set-pin-wrapper">
      <PortKeyTitle leftElement leftCallBack={backHandler} />
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
    </div>
  );
}
