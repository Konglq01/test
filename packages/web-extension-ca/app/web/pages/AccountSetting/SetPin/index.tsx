import { useCallback, useState } from 'react';
import { Form, message, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { changePin } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useAppDispatch } from 'store/Provider/hooks';
import CustomPassword from 'components/CustomPassword';
import ConfirmPassword from 'components/ConfirmPassword';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import BaseDrawer from 'components/BaseDrawer';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import aes from '@portkey-wallet/utils/aes';
import './index.less';

const FormItem = Form.Item;

export default function SetPin() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [disable, setDisable] = useState<boolean>(true);
  const [pin, setPin] = useState('');
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const walletInfo = useCurrentWalletInfo();

  const handleNext = useCallback(async () => {
    const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);
    if (privateKey) {
      setErrMsg('');
      setDisable(false);
      setOpen(true);
    } else {
      setPin('');
      setErrMsg('Incorrect Pin');
      setDisable(true);
    }
  }, [pin, walletInfo.AESEncryptPrivateKey]);

  const handleSave = useCallback(async () => {
    const newPin = form.getFieldValue('confirmPassword');
    dispatch(setPasswordSeed(newPin));
    dispatch(
      changePin({
        pin,
        newPin,
      }),
    );
    await setPinAction(newPin);
    message.success(t('Modified Successfully'));
    navigate('/setting/account-setting');
  }, [dispatch, form, navigate, pin, t]);

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.error(errorInfo, 'onFinishFailed==');
    message.error('Something error');
  }, []);

  const handleInputChange = useCallback((v: string) => {
    setErrMsg('');
    if (!v) {
      setDisable(true);
      setPin('');
    } else {
      setDisable(false);
      setPin(v);
    }
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
    form.resetFields();
  }, [form]);

  return (
    <div className="set-pin-frame">
      <div className="set-pin-title">
        <BackHeader
          title={t('Change Pin')}
          leftCallBack={() => {
            navigate('/setting/account-setting');
          }}
          rightElement={
            <CustomSvg
              type="Close2"
              onClick={() => {
                navigate('/setting/account-setting');
              }}
            />
          }
        />
      </div>
      <div className="set-pin-content">
        <div className="label">{t('Pin')}</div>
        <CustomPassword value={pin} placeholder="Enter Pin" onChange={(e) => handleInputChange(e.target.value)} />
        <div className="error-msg">{errMsg}</div>
      </div>
      <div className="set-pin-btn">
        <Button className="submit-btn" type="primary" disabled={disable} onClick={handleNext}>
          {t('Next')}
        </Button>
      </div>
      <BaseDrawer
        destroyOnClose
        open={open}
        placement="right"
        className="setting-set-pin-drawer"
        title={
          <div className="set-pin-title">
            <BackHeader
              title={t('Change Pin')}
              leftCallBack={handleCloseDrawer}
              rightElement={<CustomSvg type="Close2" onClick={handleCloseDrawer} />}
            />
          </div>
        }>
        <Form
          className="set-pin-form"
          name="SetPinForm"
          form={form}
          requiredMark={false}
          layout="vertical"
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <div className="form-content">
            <ConfirmPassword
              label={{
                password: 'Please enter a new pin',
                confirmPassword: <div className="new-pin-label">{t('Confirm new pin')}</div>,
              }}
              validateFields={form.validateFields}
              isPasswordLengthTipShow={true}
            />
          </div>
          <div className="form-footer">
            <FormItem shouldUpdate>
              {() => (
                <Button
                  className="submit-btn"
                  type="primary"
                  disabled={
                    !form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                  onClick={handleSave}>
                  {t('Save')}
                </Button>
              )}
            </FormItem>
          </div>
        </Form>
      </BaseDrawer>
    </div>
  );
}
