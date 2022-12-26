import { Button } from 'antd';
import { IndexBar, List } from 'antd-mobile';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import './index.less';
import { AddressItem, ContactIndexType } from '@portkey/types/types-ca/contact';
import { useContact } from 'store/Provider/hooks';
import User from './User';

export default function Contacts({ onChange }: { onChange: (account: AddressItem) => void }) {
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
          <p className="no-data">No Contacts</p>
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
                        <User user={item} onChange={onChange} />
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
