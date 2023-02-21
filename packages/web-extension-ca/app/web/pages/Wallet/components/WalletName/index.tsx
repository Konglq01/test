import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Input, message } from 'antd';
import { FormItem } from 'components/BaseAntd';
import { isValidCAWalletName } from '@portkey/utils/reg';
import './index.less';

interface AccountNameProps {
  onSave: (v: string) => void;
  initValue: Record<string, string>;
}
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

export default function AccountName(props: AccountNameProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { onSave, initValue } = props;
  const [disable, setDisable] = useState<boolean>(false);
  const [validName, setValidName] = useState<{
    validateStatus?: ValidateStatus;
    errorMsg?: string;
  }>({
    validateStatus: '',
    errorMsg: '',
  });

  const handleInputChange = useCallback((value: string) => {
    setValidName({
      validateStatus: '',
      errorMsg: '',
    });
    if (!value) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, []);

  const handleSave = useCallback(
    (name: string) => {
      if (!name) {
        setValidName({
          validateStatus: 'error',
          errorMsg: 'Please Enter Wallet Name',
        });
        form.setFieldValue('name', '');
        setDisable(true);
      } else if (!isValidCAWalletName(name)) {
        setValidName({
          validateStatus: 'error',
          errorMsg: 'only a-z, A-Z, 0-9 and "_" allowed',
        });
        setDisable(true);
      } else {
        onSave(name);
      }
    },
    [form, onSave],
  );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.error(errorInfo, 'onFinishFailed==');
    message.error('Something error');
  }, []);

  return (
    <div className="wallet-name-drawer">
      <Form
        form={form}
        colon={false}
        layout="vertical"
        initialValues={initValue}
        onFinish={(v) => handleSave(v.name.trim())}
        onFinishFailed={onFinishFailed}>
        <div className="form-content">
          <FormItem
            name="name"
            label="Wallet Name"
            validateStatus={validName.validateStatus}
            help={validName.errorMsg}
            validateTrigger="onBlur">
            <Input
              autoComplete="off"
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={t('Enter Waller Name')}
              maxLength={16}
            />
          </FormItem>
        </div>
        <div className="form-btn">
          <FormItem>
            <Button type="primary" htmlType="submit" disabled={disable}>
              {t('Save')}
            </Button>
          </FormItem>
        </div>
      </Form>
    </div>
  );
}
