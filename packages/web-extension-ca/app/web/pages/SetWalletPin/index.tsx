import { Button, Form, message } from 'antd';
import { FormItem } from 'components/BaseAntd';
import ConfirmPassword from 'components/ConfirmPassword';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { getLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';
import { createWallet, setSessionId } from '@portkey/store/store-ca/wallet/actions';
import { sleep } from '@portkey/utils';
import useLocationState from 'hooks/useLocationState';
import { useTranslation } from 'react-i18next';
import { createWalletInfo, fetchCreateWalletResult } from '@portkey/api/apiUtils/wallet';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import AElf from 'aelf-sdk';
import { VerificationType } from '@portkey/types/verifier';
import './index.less';

export default function SetWalletPin() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { state } = useLocationState<'login' | 'register'>();
  // const { state } = useLocation();
  const currentNetwork = useCurrentNetworkInfo();

  console.log(state, 'state====');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { loginAccount } = useLoginInfo();
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
        verificationType: state === 'login' ? VerificationType.communityRecovery : VerificationType.register,
        // TODO
        deviceString: '',
      });
      return loginAccount.managerUniqueId;
    },
    [currentNetwork.apiUrl, loginAccount, state],
  );

  const getCreateWalletResult = useCallback(
    async (address: string) => {
      if (!loginAccount?.loginGuardianType || (!loginAccount.accountLoginType && loginAccount.accountLoginType !== 0))
        return message.error('Missing account!!! Please login/register again');

      const res = await fetchCreateWalletResult({
        baseUrl: currentNetwork.apiUrl,
        type: loginAccount?.accountLoginType,
        verificationType: state === 'login' ? VerificationType.communityRecovery : VerificationType.register,
        loginGuardianType: loginAccount.loginGuardianType,
        managerUniqueId: loginAccount.managerUniqueId,
        managerAddress: address,
      });
      console.log(res, 'res===getCreateWalletResult');
    },
    [currentNetwork, loginAccount, state],
  );

  const onCreate = useCallback(
    async (values: any) => {
      try {
        const { pin } = values;
        console.log(pin, walletInfo, 'onCreate==');
        setLoading(true);
        const _walletInfo = walletInfo.address ? walletInfo : AElf.wallet.createNewWallet();
        console.log(pin, walletInfo, _walletInfo, 'onCreate==');
        // Step 9
        const sessionId = await createAndGetSessionId({ managerAddress: _walletInfo.address });
        !walletInfo.address
          ? dispatch(
              createWallet({
                walletInfo: _walletInfo,
                pin,
                sessionId,
              }),
            )
          : dispatch(setSessionId({ pin, sessionId }));
        await setPinAction(pin);
        await setLocalStorage({
          registerStatus: 'registeredNotGetCaAddress',
        });

        // TODO Step 14 Only get Main Chain caAddress
        const res = await getCreateWalletResult(_walletInfo.address);

        // fetchCreateWalletResult

        // await setLocalStorage({
        //   registerStatus: 'Registered',
        // });
        // navigate('/register/success', { state });
      } catch (error) {
        setLoading(false);
        console.log(error, 'onCreate');
        const isErrorString = typeof error === 'string';
        message.error(isErrorString ? error : 'Something error');
      }
      setLoading(false);
    },
    [createAndGetSessionId, dispatch, getCreateWalletResult, setLoading, walletInfo],
  );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.error(errorInfo, 'onFinishFailed==');
    message.error('Something error');
  }, []);

  const backHandler = useCallback(async () => {
    // if (state === 'register') {
    //   navigate('/register/select-verifier');
    // } else if (state === 'login') {
    //   navigate('/login/guardian-approval');
    // }
    // getCreateWalletResult(walletInfo.address);
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
