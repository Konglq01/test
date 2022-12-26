import { useAppCommonDispatch } from '@portkey/hooks';
import { fetchContractListAsync } from '@portkey/store/store-ca/contact/actions';
import { AddressItem } from '@portkey/types/types-ca/contact';
import { Tabs } from 'antd';

import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import Contacts from './Contacts';
import './index.less';
import Recent from './Recent';

export default function AddressSelector({ onClick }: { onClick: (account: AddressItem & { name?: string }) => void }) {
  const dispatch = useAppCommonDispatch();

  const { t } = useTranslation();
  useEffectOnce(() => {
    // refetch();
    dispatch(fetchContractListAsync());
  });

  return (
    <Tabs
      className="address-selector"
      items={[
        {
          label: t('Recents'),
          key: 'recents',
          children: <Recent onChange={onClick} />,
        },
        {
          label: t('Contacts'),
          key: 'contracts',
          children: <Contacts onChange={onClick} />,
        },
      ]}
    />
  );
}
