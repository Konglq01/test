import clsx from 'clsx';
import { useNavigate } from 'react-router';
import { Button, Input, message } from 'antd';
import { IndexBar, List } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useContact } from '@portkey/hooks/hooks-ca/contact';
import { useAppDispatch } from 'store/Provider/hooks';
import { fetchContactListAsync } from '@portkey/store/store-ca/contact/actions';
import { getAelfAddress, isAelfAddress } from '@portkey/utils/aelf';
import { ContactIndexType, ContactItemType } from '@portkey/types/types-ca/contact';
import { useEffectOnce } from 'react-use';
import './index.less';

const initContactItem: Partial<ContactItemType> = {
  id: '-1',
  name: '',
  addresses: [{ chainId: 'AELF', address: '' }],
};

export default function Contacts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const { contactIndexList } = useContact();
  const [curList, setCurList] = useState<ContactIndexType[]>(contactIndexList);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  useEffectOnce(() => {
    appDispatch(fetchContactListAsync());
  });

  useEffect(() => {
    setCurList(contactIndexList);
    setIsSearch(false);
  }, [contactIndexList]);

  const searchContacts = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (!value) {
        setCurList(contactIndexList);
        setIsSearch(false);
        return;
      }
      const contactIndexFilterList: ContactIndexType[] = [];

      if (value.length <= 16) {
        // Name search
        contactIndexList.forEach(({ index, contacts }) => {
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter((contact) => contact.name.trim().toLowerCase() === value.trim().toLowerCase()),
          });
        });
      } else {
        // Address search
        let suffix = '';
        if (value.includes('_')) {
          const arr = value.split('_');
          if (!isAelfAddress(arr[arr.length - 1])) {
            suffix = arr[arr.length - 1];
          }
        }
        value = getAelfAddress(value);
        contactIndexList.forEach(({ index, contacts }) => {
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter((contact) =>
              contact.addresses.some((ads) => ads.address === value && (!suffix || suffix === ads.chainId)),
            ),
          });
        });
      }
      setCurList(contactIndexFilterList);
      setIsSearch(true);
    },
    [contactIndexList],
  );

  const curTotalContactsNum = useMemo(() => {
    return curList.reduce((pre, cv) => pre + cv.contacts.length, 0);
  }, [curList]);

  return (
    <div className="flex-column contacts-frame">
      <div className="flex-column contacts-title">
        <BackHeader
          title={t('Contacts')}
          leftCallBack={() => {
            navigate('/setting');
          }}
          rightElement={
            (curTotalContactsNum !== 0 || (curTotalContactsNum === 0 && isSearch)) && (
              <div className="flex-center header-right-close">
                <Button
                  onClick={() => {
                    navigate('/setting/contacts/add', { state: initContactItem });
                  }}>
                  {t('Add contact')}
                </Button>
                <CustomSvg
                  type="Close2"
                  onClick={() => {
                    navigate('/setting');
                  }}
                />
              </div>
            )
          }
        />
        <Input
          className="search-input"
          prefix={<CustomSvg type="SearchBlur" className="search-svg" />}
          placeholder="Name or Address"
          onChange={searchContacts}
        />
      </div>
      <div className={clsx(['contacts-body', isSearch && 'index-bar-hidden'])}>
        {curTotalContactsNum === 0 ? (
          isSearch ? (
            <div className="flex-center no-search-result">There is no search result.</div>
          ) : (
            <div className="flex-column no-contact">
              <p className="title">{t('No Contacts')}</p>
              <p className="desc">{t("Contacts you've added will appear here")}</p>
              <CustomSvg type="AddressBook" className="no-contact-svg" />
              <Button
                className="flex-row-center add-button"
                type="text"
                onClick={() => {
                  navigate('/setting/contacts/add', { state: initContactItem });
                }}>
                <CustomSvg type="Plus" className="plug-svg" /> {t('Add New Contact')}
              </Button>
            </div>
          )
        ) : (
          <IndexBar>
            {curList.map(({ index, contacts }) => {
              return (
                <IndexBar.Panel
                  className={!contacts.length && isSearch ? 'contact-empty' : ''}
                  index={index}
                  title={index}
                  key={index}>
                  <List>
                    {contacts.map((item) => (
                      <List.Item
                        key={`${item.id}_${item.name}`}
                        onClick={() => {
                          navigate('/setting/contacts/view', { state: { ...item, index: index } });
                        }}>
                        <div className="flex contact-item-content">
                          <div className="flex-center contact-index-logo">{t(index)}</div>
                          <span className="contact-item-name">{item.name}</span>
                        </div>
                      </List.Item>
                    ))}
                  </List>
                </IndexBar.Panel>
              );
            })}
          </IndexBar>
        )}
      </div>
    </div>
  );
}
