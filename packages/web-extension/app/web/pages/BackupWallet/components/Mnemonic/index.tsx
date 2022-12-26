import { Button, Checkbox } from 'antd';
import Copy from 'components/Copy';
import { MouseEventHandler, useCallback, useState } from 'react';
import FileSaver from 'file-saver';
import { useAppSelector } from 'store/Provider/hooks';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';

export default function Mnemonic({ mnemonic, onNext }: { mnemonic: string; onNext: MouseEventHandler<HTMLElement> }) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<boolean>();
  const { walletInfo } = useAppSelector((state) => state.wallet);

  const downLoadMnemonic = useCallback(async () => {
    const blob = new Blob([mnemonic ?? ''], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `Portkey_Mnemonic_file_${walletInfo?.address || ''}.txt`);
  }, [mnemonic, walletInfo?.address]);

  return (
    <div className="backup-content mnemonic-wrapper">
      <div className="backup-content-left">
        <h1>{t('Secret Recovery Phrase')}</h1>
        <p className="description">
          {t(
            "This is your Secret Recovery Phrase. Please write it down and store it in a safe place. You'll be asked to re-enter this phrase (in the right order) on the next step.",
          )}
        </p>

        {mnemonic && (
          <>
            <div className="mnemonic-container">{mnemonic}</div>
            <div className="flex-row-center action-wrapper">
              <Copy toCopy={mnemonic}>{t('Copy')}</Copy>
              <div className="flex-row-center download-wrapper" onClick={downLoadMnemonic}>
                <CustomSvg type="Download" className="icon" />
                {t('Download')}
              </div>
            </div>
          </>
        )}
        <Checkbox
          className="agree-check"
          checked={!!checked}
          disabled={!mnemonic}
          onChange={(e) => setChecked(e.target.checked)}>
          {t('I have stored it in a safe place')}
        </Checkbox>
        <Button className="submit-btn" type="primary" disabled={!checked} onClick={onNext}>
          {t('Next')}
        </Button>
      </div>
      <div className="backup-content-right">
        <div className="tips-content">
          <div className="tips-content-title">{t('Tips_with_colon')}</div>
          <div>
            {t('Never reveal your secret recovery phrase to others. Anyone who holds it can control your wallet')}
          </div>
        </div>
      </div>
    </div>
  );
}
