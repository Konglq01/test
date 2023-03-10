import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Input } from 'antd';
import { FormItem } from 'components/BaseAntd';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import './index.less';

interface DeviceDetailProps {
  initValue: Record<string, string>;
  onSave: (v: string) => void;
}
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

export default function DeviceDetail(props: DeviceDetailProps) {
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
      if (!isValidCAWalletName(name)) {
        setValidName({
          validateStatus: 'error',
          errorMsg: '3-16 characters, only a-z, A-Z, 0-9, space and "_" allowed',
        });
        setDisable(true);
      } else {
        onSave(name);
      }
    },
    [onSave],
  );

  return (
    <div className="device-detail-frame">
      <Form
        form={form}
        colon={false}
        layout="vertical"
        initialValues={initValue}
        onFinish={(v) => handleSave(v.name.trim())}>
        <div className="form-content">
          <FormItem name="name" validateStatus={validName.validateStatus} help={validName.errorMsg}>
            <Input
              autoComplete="off"
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={t('Enter Device Name')}
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
