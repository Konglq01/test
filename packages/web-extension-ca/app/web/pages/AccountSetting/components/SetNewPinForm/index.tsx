import { Form, Button, FormProps } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import ConfirmPassword from 'components/ConfirmPassword';
import { ReactNode } from 'react';

export interface ISetNewPinFormProps extends FormProps {
  onSave: () => void;
  setPinLabel: ReactNode; //'Please enter a new pin'
  confirmPinLabel: ReactNode; //'Confirm new pin'
  btnText: string; //'Save'
}
export default function SetNewPinForm({
  form,
  onFinishFailed,
  onSave,
  setPinLabel,
  confirmPinLabel,
  btnText,
}: ISetNewPinFormProps) {
  return (
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
            password: setPinLabel,
            confirmPassword: <div className="new-pin-label">{confirmPinLabel}</div>,
          }}
          validateFields={form?.validateFields}
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
                !form?.isFieldsTouched(true) || !!form?.getFieldsError().filter(({ errors }) => errors.length).length
              }
              onClick={onSave}>
              {btnText}
            </Button>
          )}
        </FormItem>
      </div>
    </Form>
  );
}
