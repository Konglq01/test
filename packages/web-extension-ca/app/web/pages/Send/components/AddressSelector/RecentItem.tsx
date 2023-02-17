import { ContactItemType, IClickAddressProps } from '@portkey/types/types-ca/contact';
import { formatStr2EllipsisStr } from '@portkey/utils/converter';
import { useMemo } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import ContactCard from './ContactCard';

const MAIN_CHAIN_ID = 'AELF';
const MAIN_CHAIL = 'MainChain';
const SIDE_CHAIN = 'SideChain';
const TEST_NET = 'Testnet';

export default function RecentItem({
  item,
  onClick,
}: {
  item: ContactItemType;
  onClick: (account: IClickAddressProps) => void;
}) {
  const { currentNetwork } = useWalletInfo();
  const isTestNet = useMemo(() => currentNetwork === 'TESTNET', [currentNetwork]);

  return item.name ? (
    <ContactCard user={item} onChange={onClick} />
  ) : (
    // In order to keep the format of Recents and Contacts consistent, this can use like {item.addresses[0]}
    <div
      className="recent-item"
      onClick={() => {
        onClick({ ...item.addresses[0] });
      }}>
      <p className="address">
        <span>ELF_</span>
        <span>
          {formatStr2EllipsisStr(item.addresses[0].address, [6, 6])}_{item.addresses[0].chainId}
        </span>
      </p>
      <p className="network">
        {item.addresses[0].chainId === MAIN_CHAIN_ID ? MAIN_CHAIL : SIDE_CHAIN} {item.addresses[0].chainId}{' '}
        {isTestNet && TEST_NET}
      </p>
    </div>
  );
}
