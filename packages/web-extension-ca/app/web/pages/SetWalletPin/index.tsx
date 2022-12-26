import { Button, Form, message } from 'antd';
import { FormItem } from 'components/BaseAntd';
import ConfirmPassword from 'components/ConfirmPassword';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import './index.less';
import { createWallet, setSessionId } from '@portkey/store/store-ca/wallet/actions';
import { sleep } from '@portkey/utils';
import useLocationState from 'hooks/useLocationState';
import { useTranslation } from 'react-i18next';

export default function SetWalletPin() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { state } = useLocationState<'login' | 'register'>();
  // const { state } = useLocation();
  console.log(state, 'state====');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const createAndGetSessionId = useCallback(async () => {
    await sleep(500);
    return '2333333';
  }, []);

  const getCreateWalletResult = useCallback(async (sessionId: string) => {
    await sleep(50000);
    return '2333333';
  }, []);

  const onCreate = useCallback(
    async (values: any) => {
      try {
        const { pin } = values;
        console.log(pin, walletInfo, 'onCreate==');
        setLoading(true);
        // Step 9
        const sessionId = await createAndGetSessionId();

        !walletInfo.address
          ? dispatch(
              createWallet({
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
        // const res = await getCreateWalletResult(sessionId);

        // fetchCreateWalletResult

        // await setLocalStorage({
        //   registerStatus: 'Registered',
        // });
        navigate('/register/success', { state });
      } catch (error) {
        setLoading(false);
        console.log(error, 'onCreate');
        message.error('Something error');
      }
      setLoading(false);
    },
    [createAndGetSessionId, navigate, setLoading, state],
  );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.error(errorInfo, 'onFinishFailed==');
    message.error('Something error');
  }, []);

  const backHandler = useCallback(() => {
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
