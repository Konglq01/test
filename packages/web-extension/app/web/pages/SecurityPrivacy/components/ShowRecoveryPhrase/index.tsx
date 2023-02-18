import { Button, Form, message } from 'antd';
import { FormItem } from 'components/BaseAntd';
import Copy from 'components/Copy';
import CustomPassword from 'components/CustomPassword';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletInfo } from 'store/Provider/hooks';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';

import './index.less';

export default function ShowRecoveryPhrase({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const { walletInfo, currentAccount } = useWalletInfo();
  const [isPassword, setIsPassword] = useState<-1 | 0 | 1>(-1);
  const [form] = Form.useForm();

  const [privacy, setPrivacy] = useState<string>();

  const onFinish = useCallback(
    async (values: any) => {
      const { password } = values;
      // currentAccount?.AESEncryptPrivateKey
      const param = {
        AESEncryptMnemonic: walletInfo?.AESEncryptMnemonic,
        AESEncryptPrivateKey: walletInfo?.AESEncryptPrivateKey,
      };
      console.log(walletInfo?.AESEncryptMnemonic, password);
      setIsPassword(-1);
      if (!walletInfo) return message.error('Unable to get user information');
      try {
        const result = await getPrivateKeyAndMnemonic(param, password);
        if (result?.mnemonic) {
          setIsPassword(1);
          setPrivacy(result.mnemonic);
        }
      } catch (error: any) {
        setIsPassword(0);
      }
    },
    [walletInfo],
  );

  return (
    <div className="show-recovery-phrase">
      <div className="tips">
        {t(
          'If you switch to other devices or browsers, you will need this Secret Recovery Phrase to access your accounts. Please save it in a safe place',
        )}
      </div>
      <div className="title">{t('Show Secret Recovery Phrase')}</div>
      <div className="content">
        {isPassword !== 1 ? (
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
            onValuesChange={(v) => {
              if ('password' in v) {
                if (!v.password) return setIsPassword(0);
                setIsPassword(-1);
              }
            }}>
            <div className="form-content">
              <FormItem
                label={t('Enter Password to Continue')}
                name="password"
                validateStatus={isPassword === 0 ? 'error' : undefined}
                help={isPassword === 0 ? t('Invalid Password') : undefined}
                validateTrigger={false}>
                <CustomPassword placeholder={t('Enter Password')} />
              </FormItem>

              <div className="warn-msg">
                <p>{t('DO NOT SHARE THIS PHRASE WITH ANYONE!')}</p>
                <p>{t('These words can be used to steal all your accounts.')}</p>
              </div>
            </div>

            <div className="next-btn">
              <FormItem shouldUpdate>
                {() => (
                  <Button type="primary" htmlType="submit" disabled={!form.isFieldsTouched(true) || isPassword === 0}>
                    {t('Show Secret Recovery Phrase')}
                  </Button>
                )}
              </FormItem>
            </div>
          </Form>
        ) : (
          <div className="recovery-phrase-area">
            <div className="recovery-phrase-content">
              {privacy && (
                <>
                  <div className="recovery-phrase-box">{privacy}</div>
                  <Copy iconType="Copy" className="copy-btn" toCopy={privacy}>
                    {t('Copy')}
                  </Copy>
                  <div className="warn-msg">
                    <p>{t('DO NOT SHARE THIS PHRASE WITH ANYONE!')}</p>
                    <p>{t('These words can be used to steal all your accounts.')}</p>
                  </div>
                </>
              )}
            </div>
            <div className="next-btn">
              <Button type="primary" onClick={onBack}>
                {t('Close')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
