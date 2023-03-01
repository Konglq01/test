import { ContactItemType, IClickAddressProps } from '@portkey/types/types-ca/contact';
import { transNetworkText } from '@portkey/utils/activity';
import { formatStr2EllipsisStr } from '@portkey/utils/converter';
import { useIsTestnet } from 'hooks/useActivity';
import ContactCard from './ContactCard';

export default function RecentItem({
  item,
  onClick,
}: {
  item: ContactItemType;
  onClick: (account: IClickAddressProps) => void;
}) {
  const isTestNet = useIsTestnet();

  return item.name ? (
    <ContactCard user={item} onChange={onClick} className="contact-card-in-recent" />
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
      <p className="network">{transNetworkText(item.addresses[0].chainId, isTestNet)}</p>
    </div>
  );
}
