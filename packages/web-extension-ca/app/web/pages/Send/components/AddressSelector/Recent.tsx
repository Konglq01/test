import { AddressItem, ContactItemType } from '@portkey/types/types-ca/contact';
import { useMemo, useState } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import User from './User';

const list: (ContactItemType | AddressItem)[] = [
  {
    id: '121',
    index: '',
    address: '26icJLGpnQke1PRyi3tXsT9maaHJsdFsjMHqtrSVKYVpctCqy4',
    // chainType: 'MAIN',
    chainId: 'AELF',
  },
  // {
  //   id: '1231',
  //   index: 'A',
  //   name: 'Ally0011',
  //   addresses: [
  //     { id: '1', chainType: 'MAIN', chainId: 'AELF', address: 'AviSYTKSFpNZwHwuAKGWQFtBQ4oG6babJJU7WtZexx8bNNAn5' },
  //     { id: '2', chainType: 'MAIN', chainId: 'tDVW', address: 'zkWrJiNT8B4af6auBzn3WuhNrd3zHtmercyQ4sar7GxM8Xwy9' },
  //   ],
  // },
  // {
  //   id: '1232',
  //   index: 'A',
  //   name: 'Ally0022',
  //   addresses: [
  //     { id: '1', chainType: 'MAIN', chainId: 'AELF', address: 'AviSYTKSFpNZwHwuAKGWQFtBQ4oG6babJJU7WtZexx8bNNAn5' },
  //     { id: '2', chainType: 'MAIN', chainId: 'tDVW', address: 'zkWrJiNT8B4af6auBzn3WuhNrd3zHtmercyQ4sar7GxM8Xwy9' },
  //   ],
  // },
];

function RecentItem({
  item,
  onClick,
}: {
  item: ContactItemType | AddressItem;
  onClick: (account: AddressItem) => void;
}) {
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => currentNetwork === 'TESTNET', [currentNetwork]);
  return (item as ContactItemType).addresses ? (
    <User user={item as ContactItemType} onChange={onClick} />
  ) : (
    <div
      className="item"
      onClick={() => {
        onClick(item as AddressItem);
      }}>
      <p className="address">
        <span>ELF_</span>
        <span>{(item as AddressItem).address}</span>
        <span>{(item as AddressItem).chainId}</span>
      </p>
      <p className="network">
        {(item as AddressItem).chainId === 'AELF' ? 'MainChain' : 'SideChain'} {(item as AddressItem).chainId}{' '}
        {isTestNet && 'Testnet'}
      </p>
    </div>
  );
}

export default function Recent({ onChange }: { onChange: (account: AddressItem & { name?: string }) => void }) {
  const [noData, setNoData] = useState(true);

  return (
    <div className="recent">
      {list.map((item, index) => (
        <RecentItem item={item} key={index} onClick={onChange} />
      ))}
      {noData && <p className="no-data">No Data</p>}
    </div>
  );
}
