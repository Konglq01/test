import { request } from '@portkey/api/api-did';
import { ContactItemType, IClickAddressProps, RecentContactItemType } from '@portkey/types/types-ca/contact';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useContact } from '@portkey/hooks/hooks-ca/contact';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import RecentItem from './RecentItem';
import { ChainId } from '@portkey/types';

interface ApiRecentAddressItemType {
  caAddress: string;
  chainId: string;
  name: string;
  transactionTime: string;
  address: string;
  addressChainId: string;
}

const MAX_RESULT_ACCOUNT = 10;
const RECENT_COUNT_LIMIT = 100;
const NO_RECENT_TEXT = 'There is no recents.';

export default function Recents({
  onChange,
  chainId,
}: {
  onChange: (account: IClickAddressProps) => void;
  chainId: ChainId;
}) {
  const { t } = useTranslation();
  const currentWallet = useCurrentWallet();
  const { walletInfo } = currentWallet;
  const { contactMap } = useContact();
  const [loading, setLoading] = useState<boolean>(false);
  const [skipCount, setSkipCount] = useState(0);
  const [recentTotalNumber, setRecentTotalNumber] = useState(0);
  const [recentList, setRecentList] = useState<(ContactItemType | RecentContactItemType)[]>([]);

  const fetchRecents = useCallback(() => {
    setLoading(true);
    return request.recent.fetchRecentTransactionUsers({
      params: {
        caAddresses: [walletInfo[chainId]?.caAddress],
        skipCount,
        maxResultCount: MAX_RESULT_ACCOUNT,
      },
    });
  }, [chainId, skipCount, walletInfo]);

  // Convert data so that the formats of Recents and Contacts are consistent, and get contactName for Recents.
  const parseRecentsListToContactMap = useCallback(
    (data: ApiRecentAddressItemType[]): any[] =>
      data.map((ele: ApiRecentAddressItemType) => {
        if (contactMap?.[ele.address]) {
          const contactInfo = contactMap?.[ele.address][0];
          return { ...contactInfo, address: ele.address, transactionTime: ele.transactionTime };
        }
        return { ...ele, addresses: [{ address: ele.address, chainId: ele.addressChainId }] };
      }),
    [contactMap],
  );

  const recentsListLimit = (list: any[]) => {
    if (list.length <= RECENT_COUNT_LIMIT) return list;
    return list.slice(0, RECENT_COUNT_LIMIT);
  };

  // init Recents
  useEffectOnce(() => {
    fetchRecents().then((res) => {
      const { data, totalRecordCount } = res;
      setSkipCount(MAX_RESULT_ACCOUNT);
      setRecentList(recentsListLimit(parseRecentsListToContactMap(data as ApiRecentAddressItemType[])));
      setRecentTotalNumber(totalRecordCount);
      setLoading(false);
    });
  });

  // load more recents
  const fetchMoreRecent = useCallback(async () => {
    if (loading || recentTotalNumber >= RECENT_COUNT_LIMIT) return;

    try {
      const res = await fetchRecents();
      const { data, totalRecordCount } = res;
      const skipCountCompute =
        skipCount + MAX_RESULT_ACCOUNT < RECENT_COUNT_LIMIT ? skipCount + MAX_RESULT_ACCOUNT : RECENT_COUNT_LIMIT;
      setSkipCount(skipCountCompute);
      setRecentList([...recentList, ...parseRecentsListToContactMap(data as ApiRecentAddressItemType[])]);
      setRecentTotalNumber(totalRecordCount);
      setLoading(false);
    } catch (error) {
      throw Error(JSON.stringify(error));
    }
  }, [loading, recentTotalNumber, fetchRecents, skipCount, recentList, parseRecentsListToContactMap]);

  return (
    <div className="recents">
      {recentList.map((item, index) => (
        <RecentItem item={item} key={index} onClick={onChange} />
      ))}
      <LoadingMore hasMore={recentList.length < recentTotalNumber} loadMore={fetchMoreRecent} />
      {recentList.length === 0 && <p className="no-data">{t(NO_RECENT_TEXT)}</p>}
    </div>
  );
}
