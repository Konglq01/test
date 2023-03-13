import { useCallback } from 'react';
import { Form, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import ConfirmPassword from 'components/ConfirmPassword';

const FormItem = Form.Item;

interface ISetNewPinProps {
  setCurPin: (pin: string) => void;
  handleNextStage: () => void;
}

export default function SetNewPin({ setCurPin, handleNextStage }: ISetNewPinProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleNext = useCallback(async () => {
    const inputPin = form.getFieldValue('confirmPassword');
    setCurPin(inputPin);
    handleNextStage();
  }, [form, handleNextStage, setCurPin]);

  return (
    <div className="set-pin">
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
                onClick={handleNext}>
                {t('Next')}
              </Button>
            )}
          </FormItem>
        </div>
      </Form>
    </div>
  );
}
