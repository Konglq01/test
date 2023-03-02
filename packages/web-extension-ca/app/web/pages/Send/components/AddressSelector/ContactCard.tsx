import { ContactItemType, IClickAddressProps } from '@portkey/types/types-ca/contact';
import { transNetworkText } from '@portkey/utils/activity';
import { formatStr2EllipsisStr } from '@portkey/utils/converter';
import { Collapse } from 'antd';
import clsx from 'clsx';
import { useIsTestnet } from 'hooks/useActivity';
import { useCallback, useMemo } from 'react';

export interface IContactCardProps {
  user: ContactItemType & { address?: string };
  onChange: (account: IClickAddressProps) => void;
  fromRecents?: boolean;
  className?: string;
}
export default function ContactCard({ user, className, fromRecents = true, onChange }: IContactCardProps) {
  const isTestnet = useIsTestnet();
  const isDisabled = useCallback(
    (itemAddress: string | undefined): boolean => fromRecents && user.address !== itemAddress,
    [fromRecents, user.address],
  );
  const header = useMemo(
    () => (
      <div className="header">
        <div className="icon">{user.index || ''}</div>
        <p>{user.name}</p>
      </div>
    ),
    [user.index, user.name],
  );

  return (
    <Collapse key={user.id} className={clsx('contact-card', className)}>
      <Collapse.Panel header={header} key={user.id}>
        <div className="content">
          {user.addresses.map((address) => (
            <p
              key={address.address}
              className={isDisabled(address.address) ? 'disabled' : ''}
              onClick={() => onChange({ ...address, name: user.name, isDisable: isDisabled(address.address) })}>
              <span className="address">
                ELF_{formatStr2EllipsisStr(address.address, [6, 6])}_{address.chainId}
              </span>
              <span className="network">{transNetworkText(address.chainId, isTestnet)}</span>
            </p>
          ))}
        </div>
      </Collapse.Panel>
    </Collapse>
  );
}
