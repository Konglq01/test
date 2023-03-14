import { useCallback } from 'react';
import { Form, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { changePin } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useAppDispatch, useUserInfo } from 'store/Provider/hooks';
import ConfirmPassword from 'components/ConfirmPassword';
import { useNavigate } from 'react-router';
import { setPasswordSeed } from 'store/reducers/user/slice';
import './index.less';

const FormItem = Form.Item;

interface ISetNewPinProps {
  setIsChangePin: (f: boolean) => void;
}

export default function SetNewPin() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { passwordSeed } = useUserInfo();

  const handleSave = useCallback(async () => {
    const newPin = form.getFieldValue('confirmPassword');
    dispatch(setPasswordSeed(newPin));
    dispatch(
      changePin({
        pin: passwordSeed,
        newPin,
      }),
    );
    await setPinAction(newPin);
    navigate('/setting/account-setting');
  }, [dispatch, form, navigate, passwordSeed]);

  return (
    <div className="set-pin-frame">
      <Form
        className="set-pin-form"
        name="SetPinForm"
        form={form}
        requiredMark={false}
        layout="vertical"
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
                {t('Next')}
              </Button>
            )}
          </FormItem>
        </div>
      </Form>
    </div>
  );
}
