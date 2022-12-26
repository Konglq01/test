import { Button, message } from 'antd';
import Copy from 'components/Copy';
import CustomPassword from 'components/CustomPassword';
import { useCallback, useState } from 'react';
import { AESEncryptWalletParam } from 'types/wallet';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import { AccountType } from '@portkey/types/wallet';
import './index.less';
import { useTranslation } from 'react-i18next';

interface ExportPrivateKeyProps {
  onClose?: () => void;
  onBack?: () => void;
  accountInfo: AccountType;
}
export default function ExportPrivateKey({
  accountInfo,
  AESEncryptPrivateKey,
  onClose,
}: AESEncryptWalletParam & ExportPrivateKeyProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>();
  const [isInvalid, setIsInvalid] = useState<boolean>(true);
  const [privateKey, setPrivateKey] = useState<string>();

  const ShowPrivateKey = useCallback(async () => {
    if (!password) return message.error('Please enter password!');
    // try {
    getPrivateKeyAndMnemonic({ AESEncryptPrivateKey }, password)
      .then((result) => {
        console.log(result, 'result===');
        setPrivateKey(result?.privateKey);
        setIsInvalid(true);
      })
      .catch((e) => {
        console.log(e, 'error');
        setIsInvalid(false);
      });

    // } catch (error) {

    // }
  }, [password, AESEncryptPrivateKey]);

  return (
    <div className="edit-info">
      <div className="account-name">
        <span>{accountInfo.accountName}</span>
      </div>
      <div className="title">{t('Show Private Key')}</div>
      {isInvalid && privateKey ? (
        <>
          <div className="password-label">{t('Show Private Key')}</div>
          <div className="private-key">{privateKey}</div>
          <div className="copy-content">
            <Copy iconType="Copy" toCopy={privateKey}>
              <span className="copy-txt">{t('Copy')}</span>
            </Copy>
          </div>
        </>
      ) : (
        <>
          <div className="password-label">{t('Enter Password to Continue')}</div>
          <div className="password-ipt">
            <CustomPassword
              placeholder={t('Enter Password')}
              value={password}
              onBlur={(e) => {
                if (!e.target.value) setIsInvalid(true);
              }}
              onChange={(e) => {
                const _value = e.target.value;
                if (!_value) setIsInvalid(true);
                setPassword(e.target.value);
              }}
            />
            {!isInvalid && <div className="error-tip">{t('Invalid Password')}</div>}
          </div>
        </>
      )}
      <div className="tip-info">
        <div>{t('DO NOT SHARE THIS KEY WITH ANYONE!')}</div>
        <div>{t('These words can be used to steal all your accounts.')}</div>
      </div>
      {isInvalid && privateKey ? (
        <div className="btn-wrapper">
          <Button type="primary" onClick={onClose}>
            {t('Close')}
          </Button>
        </div>
      ) : (
        <div className="btn-wrapper">
          <Button disabled={!password} type="primary" onClick={ShowPrivateKey}>
            {t('Show Private Key')}
          </Button>
        </div>
      )}
    </div>
  );
}
