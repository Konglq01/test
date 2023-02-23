import { IndexBar, List } from 'antd-mobile';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import './index.less';
import { AddressItem, ContactIndexType } from '@portkey/types/types-ca/contact';
import { useContact } from '@portkey/hooks/hooks-ca/contact';
import ContactCard from './ContactCard';
import { useTranslation } from 'react-i18next';

const NO_CONTACT_TEXT = 'There is no contacts';

export default function Contacts({ onChange }: { onChange: (account: AddressItem) => void }) {
  const { t } = useTranslation();
  const { contactIndexList } = useContact();

  const [curList, setCurList] = useState<ContactIndexType[]>([]);

  useEffect(() => {
    setCurList(contactIndexList);
  }, [contactIndexList]);

  const curTotalContactsNum = useMemo(() => {
    return curList.reduce((pre, cv) => pre + cv.contacts.length, 0);
  }, [curList]);

  return (
    <div className="contacts">
      <div className={clsx(['contacts-body', 'index-bar-hidden'])}>
        {curTotalContactsNum === 0 ? (
          <p className="no-data">{t(NO_CONTACT_TEXT)}</p>
        ) : (
          <IndexBar>
            {curList.map(({ index, contacts }) => {
              return (
                <IndexBar.Panel
                  className={!contacts.length ? 'contact-empty' : ''}
                  index={index}
                  title={index}
                  key={index}>
                  <List>
                    {contacts.map((item) => (
                      <List.Item key={item.id}>
                        <ContactCard user={item} onChange={onChange} fromRecents={false} />
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
