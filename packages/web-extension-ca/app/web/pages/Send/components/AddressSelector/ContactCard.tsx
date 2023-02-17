import { ContactItemType, IClickAddressProps } from '@portkey/types/types-ca/contact';
import { formatStr2EllipsisStr } from '@portkey/utils/converter';
import { Collapse } from 'antd';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';

export interface IContactCardProps {
  user: ContactItemType;
  onChange: (account: IClickAddressProps) => void;
  fromRecents?: boolean;
  className?: string;
}
export default function ContactCard({ user, className, fromRecents = true, onChange }: IContactCardProps) {
  const { currentNetwork } = useWalletInfo();
  const isTestnet = useMemo(() => currentNetwork === 'TESTNET', [currentNetwork]);
  const disabledStyle = useMemo(() => (!fromRecents ? '' : 'disabled'), [fromRecents]);
  const header = useMemo(
    () => (
      <div className="header">
        <div className="icon">{user.name?.[0]}</div>
        <p>{user.name}</p>
      </div>
    ),
    [user.name],
  );
  return (
    <Collapse key={user.id} className={clsx('contact-card', className)}>
      <Collapse.Panel header={header} key={user.id}>
        <div className="content">
          {user.addresses.map((address) => (
            <p
              key={address.address}
              className={disabledStyle}
              onClick={() => onChange({ ...address, name: user.name, isDisable: fromRecents })}>
              <span className="address">
                ELF_{formatStr2EllipsisStr(address.address, [6, 6])}_{address.chainId}
              </span>
              <span className="network">
                {address.chainId === 'AELF' ? 'MainChain' : 'SideChain'} {address.chainId}
                {isTestnet && ' Testnet'}
              </span>
            </p>
          ))}
        </div>
      </Collapse.Panel>
    </Collapse>
  );
}
