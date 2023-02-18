import { WalletError } from '@portkey/store/wallet/type';
import { Button, Form, FormProps, message } from 'antd';
import { FormItem } from 'components/BaseAntd';
import CustomPassword from 'components/CustomPassword';
import CustomSvg from 'components/CustomSvg';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { useCallback, useState } from 'react';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import PortKeyTitle from '../../components/PortKeyTitle';
import ResetWalletModal from '../ResetWalletModal';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { useDispatch } from 'react-redux';
import './index.less';
import { useTranslation } from 'react-i18next';

interface LockPageProps extends FormProps {
  onUnLockHandler?: () => void;
}

export default function LockPage({ onUnLockHandler, ...props }: LockPageProps) {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [resetModalVisible, setResetModalVisible] = useState<boolean>();
  const [isPassword, setIsPassword] = useState<-1 | 0 | 1>(-1);
  const dispatch = useDispatch();

  const onFinish = useCallback(
    async (values: any) => {
      const { password } = values;
      setIsPassword(-1);
      let walletInfo = null;
      try {
        const reduxStorage = await getLocalStorage('reduxStorageName');
        walletInfo = JSON.parse(JSON.parse(reduxStorage).wallet).walletInfo;
      } catch (e) {
        walletInfo = null;
      }
      if (!walletInfo) return message.error(WalletError.noCreateWallet);

      try {
        const result = await getPrivateKeyAndMnemonic(
          {
            AESEncryptMnemonic: walletInfo?.AESEncryptMnemonic,
            AESEncryptPrivateKey: walletInfo?.AESEncryptPrivateKey,
          },
          password,
        );
        if (result) {
          setIsPassword(1);
          dispatch(setPasswordSeed(password));
          InternalMessage.payload(InternalMessageTypes.SET_SEED, password).send();
          onUnLockHandler?.();
        }
      } catch (error: any) {
        setIsPassword(0);
      }
    },
    [dispatch, onUnLockHandler],
  );

  return (
    <>
      <div className="lock-page-wrapper">
        <div className="lock-page-header">
          <CustomSvg type="PortKey" style={{ width: 31, height: 32 }} />
        </div>
        <div className="lock-page-content">
          <div className="logo-wrapper">
            <CustomSvg type="PortKey" style={{ width: 85, height: 88 }} />
            <h1>{t('Welcome back!')}</h1>
          </div>
          <Form
            {...props}
            className="unlock-form"
            onValuesChange={(v) => {
              if ('password' in v) {
                if (!v.password) return setIsPassword(0);
                setIsPassword(-1);
              }
            }}
            form={form}
            name="unlock"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off">
            <FormItem
              className="customer-password"
              label={t('Password')}
              name="password"
              validateStatus={isPassword === 0 ? 'error' : undefined}
              help={isPassword === 0 ? t('Invalid Password') : undefined}
              validateTrigger={false}>
              <CustomPassword className="custom-password" placeholder={t('Enter Password')} />
            </FormItem>

            <FormItem shouldUpdate>
              {() => (
                <Button
                  className="submit-btn"
                  type="primary"
                  htmlType="submit"
                  disabled={
                    // !form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length
                    !form.isFieldsTouched(true) || isPassword === 0
                  }>
                  {t('Unlock')}
                </Button>
              )}
            </FormItem>
          </Form>
          <div className="flex-row-center recover-wrapper" onClick={() => setResetModalVisible(true)}>
            {/* <CustomSvg type="Recover" /> */}
            <span>{t('Reset Wallet')}</span>
          </div>
        </div>
        <ResetWalletModal open={resetModalVisible} onCancel={() => setResetModalVisible(false)} />
      </div>
    </>
  );
}
