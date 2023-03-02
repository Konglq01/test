import { useNetwork } from '@portkey-wallet/hooks/network';
import { addressBookUpdate } from '@portkey-wallet/store/addressBook/actions';
import { AddressBookItem } from '@portkey-wallet/types/addressBook';
import { Input, Tabs, Button, List, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import AddressBookInfoDrawer from 'pages/components/AddressBookInfoDrawer';
import PromptCommonPage from 'pages/components/PromptCommonPage';
import SettingHeader from 'pages/components/SettingHeader';
import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useLocalStorage } from 'react-use';
import { useAddressBook, useAppDispatch, useCommonState, useTradeInfo, useWalletInfo } from 'store/Provider/hooks';
import './index.less';

enum ContractListTab {
  Recent = 'Recents',
  AddressBook = 'AddressBook',
  MyAccounts = 'MyAccounts',
}

export default function ContractListPage() {
  const { t } = useTranslation();
  const { currentRecentContact: recentContact } = useTradeInfo();
  const { currentAddressBook } = useAddressBook();
  const { accountList } = useWalletInfo();
  const { isPrompt } = useCommonState();
  const [search, setSearch] = useState<string>('');
  const [addressBookOpen, setAddressBookOpen] = useState<boolean>();
  const { currentChain } = useNetwork();
  const [tab, setTab] = useState<ContractListTab>(ContractListTab.Recent);
  const dispatch = useAppDispatch();
  const [value, setValue, remove] = useLocalStorage('ToAccount');

  const nav = useNavigate();
  const myAccounts = useMemo(
    () =>
      accountList?.map((account) => ({
        name: account.accountName,
        address: account.address,
      })),
    [accountList],
  );

  const handleSelect = useCallback(
    (address: AddressBookItem) => {
      remove();
      setValue(address);
      nav(-1);
    },
    [nav, remove, setValue],
  );

  const listRender = useCallback(
    (addressBook?: AddressBookItem[], showPrefix = true) => (
      <List
        dataSource={addressBook?.filter(
          (item) =>
            (item?.name ?? '').toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            item.address.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )}
        renderItem={(item) => (
          <List.Item onClick={() => handleSelect?.(item)}>
            {item.name && <div className="name">{item.name}</div>}
            <div className="address-wrap">
              {showPrefix && <span>{currentChain.nativeCurrency?.symbol || 'ELF'}_</span>}
              <span className="address">
                {item.address
                  .replace(`${currentChain.nativeCurrency?.symbol}_`, '')
                  .replace(`_${currentChain.chainId}`, '')}
              </span>
              {showPrefix && <span>{currentChain.chainId}</span>}
            </div>
          </List.Item>
        )}
      />
    ),
    [currentChain, handleSelect, search],
  );

  const items = useMemo(
    () => [
      {
        label: t('Recents'),
        key: ContractListTab.Recent,
        children: listRender(recentContact, false),
      },
      {
        label: t('Contacts'),
        key: ContractListTab.AddressBook,
        children: listRender(currentAddressBook),
      },
      {
        label: t('My Accounts'),
        key: ContractListTab.MyAccounts,
        children: listRender(myAccounts),
      },
    ],
    [currentAddressBook, listRender, myAccounts, recentContact],
  );

  const onAddressBookClose = useCallback(() => {
    setAddressBookOpen(false);
  }, []);

  const onSave = useCallback(
    (v: AddressBookItem) => {
      try {
        dispatch(
          addressBookUpdate({
            type: 'add',
            addressBook: v,
            currentChain,
          }),
        );
        onAddressBookClose();
      } catch (e: any) {
        e.message && message.error(e.message);
        console.log(e.message, 'onSave');
      }
    },
    [dispatch, onAddressBookClose, currentChain],
  );
  return (
    <PromptCommonPage>
      <div className="add-new-contact-drawer contract-book-page">
        <div>
          <SettingHeader
            title={t('Send to')}
            leftCallBack={() => nav(-1)}
            rightElement={<CustomSvg type="Close2" onClick={() => nav(-1)} style={{ width: '18px', height: '18px' }} />}
          />
          <div className="search-wrapper">
            <Input
              placeholder={t('Name or Address')}
              prefix={<CustomSvg type="Search" style={{ width: 20, height: 20 }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Tabs activeKey={tab} items={items} onChange={(v) => setTab(v as ContractListTab)} />
        {ContractListTab.Recent === tab && !isPrompt && (
          <div className="btn-wrap">
            <Button type="primary" onClick={() => setAddressBookOpen(true)}>
              {t('Add Contact')}
            </Button>
          </div>
        )}
        <AddressBookInfoDrawer open={addressBookOpen} type={'edit'} onClose={onAddressBookClose} onSave={onSave} />
      </div>
    </PromptCommonPage>
  );
}
