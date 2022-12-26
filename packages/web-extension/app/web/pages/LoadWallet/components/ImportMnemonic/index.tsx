import { Button, Input } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useCallback, useEffect, useState, useRef } from 'react';
import type { InputRef } from 'antd';
import aelf from 'aelf-sdk';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';

export default function Import({ onConfirm }: { onConfirm: (mnemonicWallet: any) => void }) {
  const { t } = useTranslation();

  const [show, setShow] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [mnemonic, setMnemonic] = useState<string>('');
  const iptRef = useRef(null);

  const Confirm = useCallback(() => {
    const mnemonicWallet = aelf.wallet.getWalletByMnemonic(mnemonic.replaceAll(/\s+/g, ' ').trim() || '');
    if (!mnemonicWallet) return setError(true);
    onConfirm(mnemonicWallet);
  }, [mnemonic, onConfirm]);

  useEffect(() => {
    setError(false);
  }, [mnemonic]);

  useEffect(() => {
    if (iptRef.current) {
      (iptRef.current as InputRef).focus();
    }
  }, [show]);

  return (
    <div className="import-mnemonic-wrapper">
      <h1>{t('Enter Secret Recovery Phrase')}</h1>
      <p>{t('Access an existing wallet with your Secret Recovery Phrase')}</p>
      <div>
        <div className="mnemonic-input-content">
          {show ? (
            <Input.TextArea
              ref={iptRef}
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              className="secret-wrapper"
              placeholder={t('Enter or paste your Secret Recovery Phrase, separating words with space')}
            />
          ) : (
            <Input.Password
              ref={iptRef}
              value={mnemonic}
              className="secret-wrapper"
              onChange={(e) => setMnemonic(e.target.value)}
              placeholder={t('Enter or paste your Secret Recovery Phrase, separating words with space')}
              visibilityToggle={false}
            />
          )}
          <CustomSvg
            className="show-icon"
            onClick={() => setShow(!show)}
            type={show ? 'EyeOutlined' : 'EyeInvisibleOutlined'}
          />
        </div>
        {isError && (
          <p className="error-tip">
            <InfoCircleFilled />
            <span className="msg">{t('ImportMnemonic:Invalid Secret Recovery Phrase')}</span>
          </p>
        )}
      </div>

      <Button disabled={!mnemonic || isError} type="primary" onClick={Confirm}>
        {t('Confirm')}
      </Button>
    </div>
  );
}
