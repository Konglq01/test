import './index.less';

import PromptCommonPage from 'pages/components/PromptCommonPage';
import AccountCard, { AccountCardInstance } from 'pages/components/AccountCard';
import { useAppDispatch, useAppSelector, useWalletInfo } from 'store/Provider/hooks';
import { useNavigate } from 'react-router';
import { useCallback, useRef } from 'react';
import { message } from 'antd';
import { AddressBookError } from '@portkey/store/addressBook/types';
import { updateAccountName } from '@portkey/store/wallet/actions';
import { SecurityPrivacyType } from 'pages/SecurityPrivacy';
import { useTranslation } from 'react-i18next';

export enum TokenTransferStatus {
  CONFIRMED = 'Confirmed',
  SENDING = 'Sending',
}

function AccountInfoPage() {
  const { t } = useTranslation();
  const { accountList, currentAccount } = useWalletInfo();
  const { currentChain } = useAppSelector((state) => state.chain);
  const navigate = useNavigate();
  const accountCardRef = useRef<AccountCardInstance>();
  const dispatch = useAppDispatch();
  const { passwordSeed } = useAppSelector((state) => state.userInfo);

  const onSaveAccountName = useCallback(() => {
    try {
      if (!currentAccount) return;
      const name = accountCardRef.current?.getAccountName();
      if (!name) return;
      const haveSomeName = accountList?.some((account) => account.accountName === name);
      if (haveSomeName) return message.error(t(AddressBookError.alreadyExists));
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
  }, [accountList, currentAccount, dispatch, passwordSeed, t]);

  return (
    <PromptCommonPage>
      <div id="accountCardContainer" className="account-card-container"></div>
      {currentAccount && (
        <AccountCard
          className="account-card"
          ref={accountCardRef}
          centered={false}
          accountInfo={currentAccount}
          width={'408px'}
          open={true}
          currentChain={currentChain}
          onClose={() => navigate(-1)}
          getContainer={'#accountCardContainer'}
          mask={false}
          transitionName=""
          onSaveAccountName={onSaveAccountName}
          onExportPrivateKeyClick={() => navigate(`/setting/security-privacy/${SecurityPrivacyType.showPrivateKey}`)}
        />
      )}
    </PromptCommonPage>
  );
}

export default AccountInfoPage;
