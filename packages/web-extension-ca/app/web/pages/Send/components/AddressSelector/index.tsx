import { useAppCommonDispatch } from '@portkey/hooks';
import { fetchContactListAsync } from '@portkey/store/store-ca/contact/actions';
import { ChainId } from '@portkey/types';
import { IClickAddressProps } from '@portkey/types/types-ca/contact';
import { Tabs } from 'antd';

import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import Contacts from './Contacts';
import './index.less';
import Recents from './Recents';

export default function AddressSelector({
  onClick,
  chainId,
}: {
  onClick: (account: IClickAddressProps) => void;
  chainId: ChainId;
}) {
  const dispatch = useAppCommonDispatch();

  const { t } = useTranslation();
  useEffectOnce(() => {
    // refetch();
    dispatch(fetchContactListAsync());
  });

  return (
    <Tabs
      className="address-selector"
      items={[
        {
          label: t('Recents'),
          key: 'recents',
          children: <Recents onChange={onClick} chainId={chainId} />,
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
