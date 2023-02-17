import { request } from '@portkey/api/api-did';
import { ContactItemType, IClickAddressProps, RecentContactItemType } from '@portkey/types/types-ca/contact';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useContact } from '@portkey/hooks/hooks-ca/contact';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import RecentItem from './RecentItem';

interface ApiRecentAddressItemType {
  caAddress: string;
  chainId: string;
  name: string;
  transactionTime: string;
  address: string;
  addressChainId: string;
}

const MAX_RESULT_ACCOUNT = 10;
const NO_RECENT_TEXT = 'There is no recents.';

export default function Recents({ onChange }: { onChange: (account: IClickAddressProps) => void }) {
  const { t } = useTranslation();
  const currentWallet = useCurrentWallet();
  const {
    walletInfo: { caAddressList },
  } = currentWallet;
  const { contactMap } = useContact();
  const [loading, setLoading] = useState<boolean>(false);
  const [skipCount, setSkipCount] = useState(0);
  const [recentTotalNumber, setRecentTotalNumber] = useState(0);
  const [recentList, setRecentList] = useState<(ContactItemType | RecentContactItemType)[]>([]);

  const fetchRecents = useCallback(() => {
    setLoading(true);
    return request.recent.fetchRecentTransactionUsers({
      params: {
        caAddresses: caAddressList,
        skipCount,
        maxResultCount: MAX_RESULT_ACCOUNT,
      },
    });
  }, [caAddressList, skipCount]);

  // Convert data so that the formats of Recents and Contacts are consistent, and get contactName for Recents.
  const parseRecentsListToContactMap = useCallback(
    (data: ApiRecentAddressItemType[]): any[] =>
      data.map((ele: ApiRecentAddressItemType) => {
        if (contactMap?.[ele.address]) {
          const contactInfo = contactMap?.[ele.address][0];
          return { ...contactInfo, transactionTime: ele.transactionTime };
        }
        return { ...ele, addresses: [{ address: ele.address, chainId: ele.addressChainId }] };
      }),
    [contactMap],
  );

  // init Recents
  useEffectOnce(() => {
    fetchRecents().then((res) => {
      const { data, totalRecordCount } = res;

      setSkipCount(MAX_RESULT_ACCOUNT);
      setLoading(false);
      setRecentList(parseRecentsListToContactMap(data as ApiRecentAddressItemType[]));
      setRecentTotalNumber(totalRecordCount); // todoykx max_count = 100
    });
  });

  // load more recents
  const fetchMoreRecent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchRecents();
      const { data, totalRecordCount } = res;
      setSkipCount(skipCount + MAX_RESULT_ACCOUNT);
      setLoading(false);
      setRecentList([...recentList, ...parseRecentsListToContactMap(data as ApiRecentAddressItemType[])]);
      setRecentTotalNumber(totalRecordCount);
    } catch (error) {
      // message.error(error); // todoykx
      throw Error(JSON.stringify(error));
    }
  }, [skipCount, fetchRecents, recentList, parseRecentsListToContactMap]);

  return (
    <div className="recents">
      {recentList.map((item, index) => (
        <RecentItem item={item} key={index} onClick={onChange} />
      ))}
      <LoadingMore hasMore={recentList.length < recentTotalNumber} isLoading={loading} loadMore={fetchMoreRecent} />
      {recentList.length === 0 && <p className="no-data">{t(NO_RECENT_TEXT)}</p>}
    </div>
  );
}
