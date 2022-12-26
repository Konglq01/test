import { addressBookUpdate } from '@portkey/store/addressBook/actions';
import { AddressBookItem } from '@portkey/types/addressBook';
import { Button, Input, List, message, Tabs } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { AddressBookInfoProps } from 'pages/components/AddressBookInfo';
import AddressBookInfoDrawer from 'pages/components/AddressBookInfoDrawer';
import BaseDrawer from 'pages/components/BaseDrawer';
import SettingHeader from 'pages/components/SettingHeader';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useNetwork } from 'store/Provider/hooks';
import './index.less';

interface ContactListProps extends AddressBookInfoProps {
  onClose: () => void;
  currentAddressBook: AddressBookItem[];
  recentContact?: AddressBookItem[];
  myAccounts?: AddressBookItem[];
  open?: boolean;
  onSelect?: (v: AddressBookItem) => void;
}

enum ContractListTab {
  Recent = 'Recents',
  AddressBook = 'AddressBook',
  MyAccounts = 'MyAccounts',
}

export default function ContactList({
  open,
  currentAddressBook,
  recentContact = [],
  myAccounts = [],
  onSelect,
  onClose,
}: ContactListProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [addressBookOpen, setAddressBookOpen] = useState<boolean>();
  const { currentChain } = useNetwork();
  const [tab, setTab] = useState<ContractListTab>(ContractListTab.Recent);
  const dispatch = useAppDispatch();

  const listRender = useCallback(
    (addressBook: AddressBookItem[], showPrefix = true) => (
      <List
        dataSource={addressBook?.filter(
          (item) =>
            (item?.name ?? '').toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            item.address.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )}
        renderItem={(item) => (
          <List.Item onClick={() => onSelect?.(item)}>
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
    [currentChain, onSelect, search],
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
    <BaseDrawer
      className="add-new-contact-drawer contract-book"
      title={
        <>
          <SettingHeader
            title={t('Send to')}
            leftCallBack={onClose}
            rightElement={<CustomSvg type="Close2" onClick={onClose} style={{ width: '18px', height: '18px' }} />}
          />
          <div className="search-wrapper">
            <Input
              placeholder={t('Name or Address')}
              prefix={<CustomSvg type="Search" style={{ width: 20, height: 20 }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </>
      }
      destroyOnClose
      open={open}
      placement="right"
      onClose={onClose}>
      <Tabs activeKey={tab} items={items} onChange={(v) => setTab(v as ContractListTab)} />
      {ContractListTab.Recent === tab && (
        <div className="btn-wrap">
          <Button type="primary" onClick={() => setAddressBookOpen(true)}>
            {t('Add Contact')}
          </Button>
        </div>
      )}
      <AddressBookInfoDrawer open={addressBookOpen} type={'edit'} onClose={onAddressBookClose} onSave={onSave} />
    </BaseDrawer>
  );
}
