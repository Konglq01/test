import ConfirmPassword from 'components/ConfirmPassword';
import { useState, useRef, useEffect } from 'react';
import { Button, Checkbox, Form, Input, FormProps } from 'antd';
import type { InputRef } from 'antd';
import './index.less';
import { isValidWalletName } from '@portkey-wallet/utils/reg';
import { WalletNameErrorMessage } from '@portkey-wallet/utils/wallet/types';
import CommonModal from 'components/CommonModal';
import TermsOfService from 'pages/TermsOfService';
import { useTranslation } from 'react-i18next';
const { Item: FormItem } = Form;

export type OnCreateParams = { password: string; walletName: string };

export type OnCreateCallback = (values: OnCreateParams) => void;

interface CreateWalletFormProps extends FormProps {
  loading?: boolean;
  onCreate?: OnCreateCallback;
}

export default function CreateWalletForm({ loading, onCreate, ...props }: CreateWalletFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [check, setCheck] = useState<boolean>();
  const nameIptRef = useRef(null);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState<boolean>();

  useEffect(() => {
    if (nameIptRef.current) {
      (nameIptRef.current as InputRef).focus();
    }
  }, []);

  return (
    <>
      <Form
        className="create-wallet-form"
        name="CreateWalletForm"
        {...props}
        form={form}
        requiredMark={false}
        onFinish={onCreate}
        onValuesChange={(v) => {
          if ('walletName' in v) setName(v.walletName);
          if ('password' in v) setPassword(v.password);
          if ('agree' in v) setCheck(v.agree);
        }}
        layout="vertical"
        autoComplete="off">
        <FormItem
          label={t('Wallet Name')}
          name="walletName"
          rules={[
            { max: 30, required: true },
            {
              validator(_, value) {
                if (value && !isValidWalletName(value)) {
                  return Promise.reject(WalletNameErrorMessage.invalidWalletName);
                }

                return Promise.resolve();
              },
            },
          ]}>
          <Input ref={nameIptRef} placeholder={t('Enter a Name')} maxLength={30} />
        </FormItem>
        <FormItem name="password" style={{ marginBottom: 8 }}>
          <ConfirmPassword validateFields={form.validateFields} isPasswordLengthTipShow={false} />
        </FormItem>
        <FormItem name="agree" valuePropName="checked" className="checkbox">
          <div className="agree-box">
            <Checkbox className="check-box">{t('I agree to the')}</Checkbox>
            <span
              className="agree-link"
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal(true);
              }}>
              {t('Terms of Service')}
            </span>
          </div>
        </FormItem>

        <FormItem>
          <Button
            disabled={
              !(name && password && check && !form.getFieldsError().filter(({ errors }) => errors.length).length)
            }
            loading={loading}
            type="primary"
            htmlType="submit">
            {t('Create')}
          </Button>
        </FormItem>
      </Form>
      <CommonModal
        wrapClassName="terms-of-service-modal-wrap"
        className="terms-of-service-modal"
        mask={false}
        width={'100%'}
        closable={false}
        open={openModal}>
        <TermsOfService onBack={() => setOpenModal(false)} />
      </CommonModal>
    </>
  );
}
