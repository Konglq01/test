import { WalletError } from '@portkey/store/wallet/type';
import { isWalletError } from '@portkey/store/wallet/utils';
import { Button, message, Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import BasicCreateAccount from 'pages/components/BasicCreateAccount';
import PromptCommonPage from 'pages/components/PromptCommonPage';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector, useWalletInfo } from 'store/Provider/hooks';
import { addAccountAndConnect, addAndReplaceAccountAndConnect } from 'store/utils/CreateAccountAndConnect';
import './index.less';

export default function CreateAccountPage() {
  const { t } = useTranslation();
  const [val, setVal] = useState<string>('');
  const { passwordSeed } = useAppSelector((state) => state.userInfo);
  const { accountList } = useWalletInfo();

  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const onCreateAccount = useCallback(
    async (val?: string) => {
      try {
        await dispatch(addAccountAndConnect({ password: passwordSeed, accountName: val }));
        nav('/');
      } catch (error: any) {
        const errorMessage = isWalletError(error);
        if (errorMessage === WalletError.accountExists) {
          const address = JSON.parse(error.accountInfo).address;
          const accountName = val || `Account${(accountList?.length || 0) + 1}`;

          const model = Modal.confirm({
            className: 'replace-account',
            title: (
              <div className="replace-account-header">
                <div className="title">{t('Replace Account?')}</div>
                <CustomSvg
                  onClick={() => {
                    model.destroy();
                  }}
                  type="Close2"
                  style={{ width: 18, height: 18 }}
                />
              </div>
            ),
            content: (
              <>
                <div className="account-item-card">
                  <div className="account-item-name">{accountName}</div>
                  <div className="account-item-address">{address}</div>
                </div>
                <div className="account-item-card">
                  <div className="account-item-name">
                    Import <span>{accountName}</span>
                  </div>
                  <div className="account-item-address">{address}</div>
                </div>
                <p className="replace-account-tip">
                  {t(
                    'This account has been imported via private key. To proceed, the imported account will be replaced.',
                  )}
                </p>
              </>
            ),
            width: 320,
            okText: t('Replace'),
            cancelText: t('Never Mind'),
            closable: false,
            icon: '',
            onCancel: () => {
              model.destroy();
            },
            onOk: () =>
              new Promise(async (_, reject) => {
                {
                  try {
                    await dispatch(addAndReplaceAccountAndConnect({ password: passwordSeed, accountName }));
                    model.destroy();
                    nav('/');
                  } catch (error) {
                    message.error('replace error');
                    console.log('error', error);
                    reject();
                  }
                }
              }),
          });
        } else {
          message.error(error.message || '');
        }
      }
    },
    [accountList?.length, dispatch, nav, passwordSeed, t],
  );

  return (
    <PromptCommonPage>
      <div className="create-account-page">
        <BasicCreateAccount val={val} onClose={() => nav('/')} onChange={setVal} />
        <div className="create-account-footer">
          <Button type="primary" disabled={!val} onClick={() => onCreateAccount?.(val)}>
            {t('Create')}
          </Button>
        </div>
      </div>
    </PromptCommonPage>
  );
}
