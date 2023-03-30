import { useTranslation } from 'react-i18next';
import { useCommonState, useAppDispatch } from 'store/Provider/hooks';
import { ISetNewPinFormProps } from '../components/SetNewPinForm';
import SetNewPinPopup from './Popup';
import SetNewPinPrompt from './Prompt';
import { useCallback, useEffect } from 'react';
import { Form, message } from 'antd';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { changePin } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useNavigate, useLocation } from 'react-router-dom';
import { setPasswordSeed } from 'store/reducers/user/slice';

export interface ISetNewPinProps extends ISetNewPinFormProps {
  title: string; //
  goBack?: () => void;
}
export default function SetNewPin() {
  const { isPrompt } = useCommonState();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    state: { pin },
  } = useLocation();
  const { t } = useTranslation();
  const title = t('Change Pin');
  const setPinLabel = 'Please enter a new pin';
  const confirmPinLabel = 'Confirm new pin';
  const btnText = 'Save';

  useEffect(() => {
    return form.resetFields();
  }, [form]);

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

  return isPrompt ? (
    <SetNewPinPrompt
      form={form}
      title={title}
      setPinLabel={setPinLabel}
      confirmPinLabel={confirmPinLabel}
      btnText={btnText}
      onFinishFailed={onFinishFailed}
      onSave={handleSave}
    />
  ) : (
    <SetNewPinPopup
      form={form}
      title={title}
      setPinLabel={setPinLabel}
      confirmPinLabel={confirmPinLabel}
      btnText={btnText}
      onFinishFailed={onFinishFailed}
      onSave={handleSave}
    />
  );
}
