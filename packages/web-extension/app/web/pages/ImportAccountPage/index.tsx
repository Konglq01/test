import { WalletError } from '@portkey/store/wallet/type';
import { isWalletError } from '@portkey/store/wallet/utils';
import { AccountType } from '@portkey/types/wallet';
import { Button, message } from 'antd';
import BasicImportAccount from 'pages/components/BasicImportAccount';
import ImportAccountResult from 'pages/components/ImportAccount/Result';
import PromptCommonPage from 'pages/components/PromptCommonPage';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useAppDispatch, useAppSelector } from 'store/Provider/hooks';
import { importAccountAndConnect, setCurrentAccountAndConnect } from 'store/utils/CreateAccountAndConnect';
import './index.less';

export default function ImportAccount() {
  const { t } = useTranslation();
  const [val, setVal] = useState<string>('');
  const [isValidKey, setIsValidKey] = useState<boolean>(true);
  const [importResultVisible, setImportResultVisible] = useState<boolean>(false);
  const [isImportSuccess, setIsImportSuccess] = useState<boolean>(true);
  const [currentExitAccount, setCurrentExitAccount] = useState<AccountType>();
  const { passwordSeed } = useAppSelector((state) => state.userInfo);
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const onImportConfirm = useCallback(
    async (key: string) => {
      try {
        if (!passwordSeed) return message.error('User status is invalid');
        await dispatch(importAccountAndConnect({ password: passwordSeed, privateKey: key }));
        setIsValidKey(true);
        setIsImportSuccess(true);
        setImportResultVisible(true);
      } catch (error: any) {
        const errorMessage = isWalletError(error);
        if (errorMessage === WalletError.passwordFailed) {
          setIsValidKey(false);
          return;
        }

        if (errorMessage === WalletError.accountExists) {
          setIsImportSuccess(false);
          setCurrentExitAccount(JSON.parse(error.accountInfo));
          setImportResultVisible(true);
          return;
        }
        message.error(t(errorMessage || 'Unknown Error'));
      }
    },
    [dispatch, passwordSeed, t],
  );

  const onSetAccount = useCallback(async () => {
    if (currentExitAccount) {
      await dispatch(setCurrentAccountAndConnect({ address: currentExitAccount.address, password: passwordSeed }));
      setImportResultVisible(false);
      nav('/');
    }
  }, [currentExitAccount, dispatch, nav, passwordSeed]);

  const onImportResultClose = useCallback(() => {
    isImportSuccess && nav('/');
    setImportResultVisible(false);
  }, [isImportSuccess, nav]);

  useEffectOnce(() => {
    setVal('');
  });

  return (
    <PromptCommonPage>
      <div className="import-account-page">
        <BasicImportAccount isValidKey={isValidKey} val={val} onChange={(v) => setVal(v)} onClose={() => nav(-1)} />
        <div className="import-account-footer">
          <Button type="primary" disabled={!val} onClick={() => onImportConfirm?.(val)}>
            {t('Import')}
          </Button>
        </div>
      </div>
      <ImportAccountResult
        open={importResultVisible}
        isImportSuccess={isImportSuccess}
        onClose={onImportResultClose}
        onSetAccount={onSetAccount}
      />
    </PromptCommonPage>
  );
}
