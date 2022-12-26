import { changePassword } from '@portkey/store/wallet/actions';
import { Button, Form, message } from 'antd';
import { FormItem } from 'components/BaseAntd';
import ConfirmPassword from 'components/ConfirmPassword';
import CustomPassword from 'components/CustomPassword';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { useCallback, useState } from 'react';
import { useAppDispatch, useUserInfo } from 'store/Provider/hooks';
import { useTranslation } from 'react-i18next';

import './index.less';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
enum ChangePasswordType {
  oldPassword,
  confirmPassword,
}

export default function ChangePassword({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState<ChangePasswordType>(ChangePasswordType.oldPassword);
  const [form] = Form.useForm();
  const { passwordSeed } = useUserInfo();
  const dispatch = useAppDispatch();

  const [oldValidate, setOldValidate] = useState<{
    validateStatus?: ValidateStatus;
    errorMsg?: string;
  }>({
    validateStatus: 'validating',
    errorMsg: '',
  });

  console.log(passwordSeed, 'passwordSeed==');

  const onFinish = useCallback(
    (values: any) => {
      console.log(values, passwordSeed, 'onFinish');
      try {
        if (step === ChangePasswordType.oldPassword) {
          if (values.oldPassword !== passwordSeed) {
            setOldValidate({
              validateStatus: 'error',
              errorMsg: t('Invalid Password'),
            });
            return;
          }
          setOldValidate({
            validateStatus: 'validating',
            errorMsg: '',
          });

          setStep(ChangePasswordType.confirmPassword);
        } else {
          dispatch(
            changePassword({
              password: passwordSeed,
              newPassword: values.password,
            }),
          );
          InternalMessage.payload(InternalMessageTypes.SET_SEED, values.password).send();
          onBack?.();
        }
      } catch (e: any) {
        // message.error()
        console.error(e, 'ChangePassword==');
        e.message && message.error(e.message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, passwordSeed, step],
  );

  console.log(step, 'step===');
  return (
    <div className="change-password">
      <Form form={form} onFinish={onFinish} validateTrigger="onBlur">
        <div className="form-content">
          {step === ChangePasswordType.oldPassword && (
            <FormItem
              label={t('Old Password')}
              name="oldPassword"
              validateStatus={oldValidate.validateStatus}
              validateTrigger="onChange"
              help={oldValidate.errorMsg || ''}
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    if (value === '') {
                      setOldValidate({
                        validateStatus: 'validating',
                        errorMsg: '',
                      });
                      return Promise.reject('');
                    }
                    return Promise.resolve();
                  },
                },
              ]}>
              <CustomPassword placeholder={t('Enter Old Password')} />
            </FormItem>
          )}
          {step === ChangePasswordType.confirmPassword && (
            <FormItem name="password">
              <ConfirmPassword
                label={{
                  password: t('Create New Password'),
                  newPlaceholder: t('Enter New Password'),
                  confirmPassword: t('Confirm New Password'),
                  confirmPlaceholder: t('Enter New Password'),
                }}
                validateFields={form.validateFields}
              />
            </FormItem>
          )}
        </div>

        <div className="next-btn">
          <FormItem shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length
                }>
                {step === ChangePasswordType.oldPassword ? t('Next') : t('Save')}
              </Button>
            )}
          </FormItem>
        </div>
      </Form>
    </div>
  );
}
