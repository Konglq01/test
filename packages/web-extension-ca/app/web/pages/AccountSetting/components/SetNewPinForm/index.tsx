import { Form, Button, FormProps } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import clsx from 'clsx';
import ConfirmPassword from 'components/ConfirmPassword';
import { ReactNode } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';

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
  const { isPrompt } = useCommonState();

  return (
    <Form
      className={clsx(['set-pin-form', isPrompt ? 'set-pin-form-prompt' : null])}
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
