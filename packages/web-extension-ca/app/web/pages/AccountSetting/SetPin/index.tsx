import { useCallback, useState } from 'react';
import { Form, message, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { changePin } from '@portkey/store/store-ca/wallet/actions';
import { useUserInfo, useAppDispatch } from 'store/Provider/hooks';
import CustomPassword from 'components/CustomPassword';
import ConfirmPassword from 'components/ConfirmPassword';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import { useNavigate } from 'react-router';
import BaseDrawer from 'components/BaseDrawer';
import { setPasswordSeed } from 'store/reducers/user/slice';

const FormItem = Form.Item;

export default function SetPin() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { passwordSeed } = useUserInfo();
  const [disable, setDisable] = useState<boolean>(true);
  const [pin, setPin] = useState('');
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleNext = useCallback(async () => {
    if (passwordSeed === pin) {
      setErrMsg('');
      setDisable(false);
      setOpen(true);
    } else {
      setPin('');
      setErrMsg('Incorrect Pin');
      setDisable(true);
    }
  }, [passwordSeed, pin]);

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
    navigate('/setting/account-setting');
  }, [dispatch, form, navigate, pin]);

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
            {/* <FormItem name="newPin"> */}
            <ConfirmPassword
              label={{
                password: 'Please choose a new pin',
                confirmPassword: <div className="new-pin-label">{t('Confirm new pin')}</div>,
              }}
              validateFields={form.validateFields}
              isPasswordLengthTipShow={true}
            />
            {/* </FormItem> */}
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
