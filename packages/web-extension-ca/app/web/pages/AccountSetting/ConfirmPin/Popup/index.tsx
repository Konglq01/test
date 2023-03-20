import { Form, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomPassword from 'components/CustomPassword';
import ConfirmPassword from 'components/ConfirmPassword';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import BaseDrawer from 'components/BaseDrawer';
import './index.less';

const FormItem = Form.Item;

export default function ConfirmPinPopup() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="confirm-pin-popup">
      <div className="set-pin-title">
        <BackHeader
          title={t('Change Pin')}
          leftCallBack={() => {
            navigate('/setting/account-setting');
          }}
          rightElement={
            <CustomSvg
              type="Close2"
              onClick={() => {
                navigate('/setting/account-setting');
              }}
            />
          }
        />
      </div>
      <div className="set-pin-content">
        <div className="label">{t('Pin')}</div>
        <CustomPassword value={pin} placeholder="Enter Pin" onChange={(e) => handleInputChange(e.target.value)} />
        <div className="error-msg">{errMsg}</div>
      </div>
      <div className="set-pin-btn">
        <Button className="submit-btn" type="primary" disabled={disable} onClick={handleNext}>
          {t('Next')}
        </Button>
      </div>
      <BaseDrawer
        destroyOnClose
        open={open}
        placement="right"
        className="setting-set-pin-drawer"
        title={
          <div className="set-pin-title">
            <BackHeader
              title={t('Change Pin')}
              leftCallBack={handleCloseDrawer}
              rightElement={<CustomSvg type="Close2" onClick={handleCloseDrawer} />}
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
                  {t('Save')}
                </Button>
              )}
            </FormItem>
          </div>
        </Form>
      </BaseDrawer>
    </div>
  );
}
