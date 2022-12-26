import { AddressItem, ContactItemType } from '@portkey/types/types-ca/contact';
import { Collapse } from 'antd';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';

export default function User({
  user,
  className,
  onChange,
}: {
  user: ContactItemType;
  onChange: (account: AddressItem & { name?: string }) => void;
  className?: string;
}) {
  const { currentNetwork } = useWalletInfo();
  const isTestnet = useMemo(() => currentNetwork === 'TESTNET', [currentNetwork]);
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
    <Collapse key={user.id} className={clsx('user', className)}>
      <Collapse.Panel header={header} key={user.id}>
        <div className="content">
          {user.addresses.map((address) => (
            <p key={address.address} onClick={() => onChange({ name: user.name, ...address })}>
              <span className="address">
                ELF_{address.address.replace(/(?<=^\w{6})\w+(?=\w{6})/, '...')}_{address.chainId}
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
