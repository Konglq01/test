import { useCallback, useState } from 'react';
import { Form, message, Button } from 'antd';
import { useTranslation } from 'react-i18next';
// import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { changePassword } from '@portkey/store/wallet/actions';
import { useUserInfo, useAppDispatch } from 'store/Provider/hooks';
import CustomPassword from 'components/CustomPassword';
import ConfirmPassword from 'components/ConfirmPassword';
import BaseDrawer from 'components/BaseDrawer';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';

const FormItem = Form.Item;
interface CheckPinProps {
  open: boolean;
  close: () => void;
}
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
enum SetPinStatus {
  Step1 = 'CheckCurPin',
  Step2 = 'SetNewPin',
}

export default function SetPin({ open, close }: CheckPinProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { passwordSeed } = useUserInfo();
  const [disable, setDisable] = useState<boolean>(true);
  const [step, setStep] = useState<SetPinStatus>(SetPinStatus.Step1);
  const [pinValidate, setPinValidate] = useState<{
    validateStatus?: ValidateStatus;
    errorMsg?: string;
  }>({
    validateStatus: 'validating',
    errorMsg: '',
  });

  const handleNext = useCallback(
    (v: any) => {
      const { pin } = v;
      if (pin === passwordSeed) {
        setStep(SetPinStatus.Step2);
        setPinValidate({ validateStatus: '', errorMsg: '' });
        setDisable(false);
      } else {
        form.resetFields();
        setPinValidate({ validateStatus: 'error', errorMsg: 'Incorrect Pin' });
        setDisable(true);
      }
    },
    [form, passwordSeed],
  );

  const handleSave = useCallback(
    async (v: any) => {
      const { confirmPassword: pin } = v;
      dispatch(
        changePassword({
          password: passwordSeed,
          newPassword: pin,
        }),
      );
      // await setPinAction(pin);
      form.resetFields();
      setStep(SetPinStatus.Step1);
      close();
      setDisable(true);
    },
    [close, dispatch, form, passwordSeed],
  );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.error(errorInfo, 'onFinishFailed==');
    message.error('Something error');
  }, []);

  const handleInputChange = (v: string) => {
    setPinValidate({ validateStatus: '', errorMsg: '' });
    if (!v) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const handleClose = useCallback(() => {
    if (step === SetPinStatus.Step1) {
      form.resetFields();
      close();
      setDisable(true);
    } else {
      // form.resetFields(['newPin']);
      setStep(SetPinStatus.Step1);
      setDisable(false);
    }
  }, [step, close, form]);

  return (
    <BaseDrawer
      open={open}
      placement="right"
      className="setting-set-pin-drawer"
      title={
        <div className="set-pin-title">
          <BackHeader
            title={t('Change Pin')}
            leftCallBack={handleClose}
            rightElement={<CustomSvg type="Close2" onClick={handleClose} />}
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
          {step === SetPinStatus.Step1 && (
            <FormItem name="pin" label="Pin" validateStatus={pinValidate.validateStatus} help={pinValidate.errorMsg}>
              <CustomPassword placeholder="Enter Pin" onChange={(e) => handleInputChange(e.target.value)} />
            </FormItem>
          )}
          {step === SetPinStatus.Step2 && (
            <FormItem name="newPin">
              <ConfirmPassword
                label={{ password: 'Please choose a new pin', confirmPassword: 'Confirm new pin' }}
                validateFields={form.validateFields}
                isPasswordLengthTipShow={true}
              />
            </FormItem>
          )}
        </div>
        <div className="form-footer">
          {step === SetPinStatus.Step1 && (
            <FormItem>
              <Button className="submit-btn" type="primary" disabled={disable} onClick={handleNext}>
                {t('Next')}
              </Button>
            </FormItem>
          )}
          {step === SetPinStatus.Step2 && (
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
          )}
        </div>
      </Form>
    </BaseDrawer>
  );
}
