import { removeAccount, updateAccountName } from '@portkey-wallet/store/wallet/actions';
import { Modal, message, Dropdown } from 'antd';
import Copy from 'components/Copy';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector, useCommonState, useTokenBalance, useWalletInfo } from 'store/Provider/hooks';
import AccountCard, { AccountCardInstance } from '../AccountCard';
import ImportAccount from '../ImportAccount';
import ImportAccountResult from '../ImportAccount/Result';
import ManageAccount from '../ManageAccount';
import CreateAccount from '../CreateAccount';
import { isWalletError } from '@portkey-wallet/store/wallet/utils';
import { WalletError } from '@portkey-wallet/store/wallet/type';
import { AccountType } from '@portkey-wallet/types/wallet';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { shortenCharacters } from 'utils/reg';
import AccountConnect from '../AccountConnect';
import { AddressBookError } from '@portkey-wallet/store/addressBook/types';
import {
  addAccountAndConnect,
  addAndReplaceAccountAndConnect,
  importAccountAndConnect,
  setCurrentAccountAndConnect,
} from 'store/utils/CreateAccountAndConnect';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { SandboxErrorCode } from 'service/SandboxEventService';
import { updateBalance } from '@portkey-wallet/store/tokenBalance/slice';
import { divDecimalsStr } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function AccountEdit() {
  const { t } = useTranslation();
  const { isPrompt } = useCommonState();
  const { accountList, currentAccount } = useWalletInfo();
  const { balances } = useTokenBalance();
  const { passwordSeed } = useAppSelector((state) => state.userInfo);
  const { currentChain } = useAppSelector((state) => state.chain);
  const [visible, setVisible] = useState<boolean>(false);
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [importResultVisible, setImportResultVisible] = useState<boolean>(false);
  const [accountVisible, setAccountVisible] = useState<boolean>(false);
  const [isValidKey, setIsValidKey] = useState<boolean>(true);
  const [isImportSuccess, setIsImportSuccess] = useState<boolean>(true);
  const [currentExitAccount, setCurrentExitAccount] = useState<AccountType>();
  const dispatch = useAppDispatch();
  const accountCardRef = useRef<AccountCardInstance>();
  const nav = useNavigate();

  const onImportConfirm = useCallback(
    async (key: string) => {
      try {
        if (!passwordSeed) return message.error('User status is invalid, please log in again');
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
          setCurrentExitAccount(JSON.parse(error.accountInfo));
          setIsImportSuccess(false);
          setImportResultVisible(true);
          return;
        }
        message.error(t(errorMessage || 'Unknown Error'));
      }
    },
    [dispatch, passwordSeed, t],
  );

  const onSaveAccountName = useCallback(() => {
    try {
      if (!currentAccount) return;
      const name = accountCardRef.current?.getAccountName();
      if (!name) return;
      const haveSomeName = accountList?.some((account) => account.accountName === name);
      if (haveSomeName) return message.error(AddressBookError.alreadyExists);
      dispatch(
        updateAccountName({
          address: currentAccount.address,
          accountName: name,
          password: passwordSeed,
        }),
      );
      accountCardRef.current?.setEdit();
    } catch (error) {
      message.error('something error');
    }
  }, [accountList, currentAccount, dispatch, passwordSeed]);

  const onRemoveAccount = useCallback(async () => {
    try {
      currentAccount &&
        dispatch(
          removeAccount({
            address: currentAccount.address,
            password: passwordSeed,
          }),
        );

      // NOT GOOD
      await accountCardRef.current?.setRemoveOpen?.();
      setAccountVisible(false);
    } catch (error) {
      message.error('something error');
    }
  }, [currentAccount, dispatch, passwordSeed]);

  const onCreateAccount = useCallback(
    async (val?: string) => {
      try {
        await dispatch(addAccountAndConnect({ password: passwordSeed, accountName: val }));
        setCreateVisible(false);
        setVisible(false);
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
                    setCreateVisible(false);
                    setVisible(false);
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
    [accountList?.length, dispatch, passwordSeed, t],
  );

  const onImportResultClose = useCallback(() => {
    if (isImportSuccess) {
      setImportResultVisible(false);
      setImportVisible(false);
      setVisible(false);
    } else {
      setImportResultVisible(false);
    }
  }, [isImportSuccess]);

  const onSetAccount = useCallback(async () => {
    if (currentExitAccount) {
      await dispatch(setCurrentAccountAndConnect({ address: currentExitAccount.address, password: passwordSeed }));
      setImportResultVisible(false);
      setImportVisible(false);
      setVisible(false);
    }
  }, [currentExitAccount, dispatch, passwordSeed]);

  const onOpenChange = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const getAccountBalance = useCallback(async () => {
    if (!accountList) return;
    accountList.forEach(async (account) => {
      if (!currentChain.nativeCurrency) return;
      const balanceRes = await getBalance({
        account: account.address,
        tokenList: [currentChain.nativeCurrency],
        currentChain: currentChain,
      });
      console.log(balanceRes, 'balanceRes==');
      if (balanceRes.code !== SandboxErrorCode.error) {
        balanceRes.result && dispatch(updateBalance(balanceRes.result));
      }
    });
  }, [accountList, currentChain, dispatch]);

  const accountListBalance = useMemo(
    () =>
      accountList?.map((account) => ({
        ...account,
        symbol: currentChain.nativeCurrency?.symbol ?? 'ELF',
        balances: divDecimalsStr(
          ZERO.plus(
            balances?.[currentChain.rpcUrl]?.[account?.address ?? '']?.[currentChain.nativeCurrency?.symbol ?? 'ELF'] ||
              0,
          ),
          currentChain.nativeCurrency?.decimals,
        ),
      })),
    [accountList, balances, currentChain],
  );

  useEffect(() => {
    getAccountBalance();
  }, [getAccountBalance]);

  const accountInfoClick = useCallback(() => {
    isPrompt ? nav('/account-info') : setAccountVisible(true);
  }, [isPrompt, nav]);

  return (
    <>
      <div className="current-account">
        <span className="network-connect">
          <AccountConnect />
        </span>
        <div className="account-info">
          <span className="account-name" onClick={accountInfoClick}>
            {currentAccount?.accountName}
          </span>
          <span className="account-address">
            <span>{shortenCharacters(currentAccount?.address ?? '--')}</span>
            <Copy toCopy={currentAccount?.address ?? ''} />
          </span>
        </div>
        <Dropdown
          overlayClassName="manage-account-wrapper"
          trigger={['click']}
          placement="bottomRight"
          open={visible}
          onOpenChange={onOpenChange}
          overlay={
            <ManageAccount
              defaultValue={currentAccount}
              accountList={accountListBalance}
              onCreate={() => {
                if (isPrompt) {
                  nav('/create-account');
                } else {
                  setCreateVisible(true);
                  setVisible(false);
                }
              }}
              onImport={() => {
                if (isPrompt) {
                  nav('/import-account');
                } else {
                  setImportVisible(true);
                  setVisible(false);
                }
              }}
              onAccountClick={async (account) => {
                await dispatch(setCurrentAccountAndConnect({ address: account.address, password: passwordSeed }));
                setVisible(false);
              }}
            />
          }>
          <div className="more">
            <CustomSvg type="More2" style={{ width: 20, height: 20 }} onClick={() => setVisible(true)} />
          </div>
        </Dropdown>
      </div>
      <CreateAccount open={createVisible} onClose={() => setCreateVisible(false)} onCreate={onCreateAccount} />
      <ImportAccount
        open={importVisible}
        isValidKey={isValidKey}
        onClose={() => setImportVisible(false)}
        onConfirm={onImportConfirm}
      />
      <ImportAccountResult
        open={importResultVisible}
        isImportSuccess={isImportSuccess}
        onClose={onImportResultClose}
        onSetAccount={onSetAccount}
      />
      {currentAccount && (
        <AccountCard
          className="account-card"
          ref={accountCardRef}
          accountInfo={currentAccount}
          open={accountVisible}
          currentChain={currentChain}
          onClose={() => setAccountVisible(false)}
          onSaveAccountName={onSaveAccountName}
          onRemoveAccount={onRemoveAccount}
        />
      )}
    </>
  );
}
