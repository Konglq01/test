import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import RecentItem from './RecentItem';
import { ChainId } from '@portkey-wallet/types';
import { fetchRecentListAsync } from '@portkey-wallet/store/store-ca/recent/slice';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useRecent } from '@portkey-wallet/hooks/hooks-ca/useRecent';

export default function Recents({
  onChange,
  chainId,
}: {
  onChange: (account: IClickAddressProps) => void;
  chainId: ChainId;
}) {
  const { t } = useTranslation();
  const dispatch = useAppCommonDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const currentWallet = useCurrentWallet();
  const { walletInfo } = currentWallet;
  const currentRecent = useRecent(walletInfo?.[chainId]?.caAddress || '');
  const currentRecentList = useMemo(() => currentRecent.recentContactList, [currentRecent.recentContactList]);
  const recentTotalNumber = useMemo(() => currentRecent.totalRecordCount, [currentRecent.totalRecordCount]);

  // init Recents
  useEffectOnce(() => {
    dispatch(fetchRecentListAsync({ caAddress: walletInfo?.[chainId]?.caAddress || '', isFirstTime: true }));
  });

  // load more recents
  const fetchMoreRecent = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    await dispatch(fetchRecentListAsync({ caAddress: walletInfo?.[chainId]?.caAddress || '', isFirstTime: false }));
    setLoading(false);
  }, [chainId, dispatch, loading, walletInfo]);

  return (
    <div className="recents">
      {currentRecentList.map((item, index) => (
        <RecentItem item={item} key={index} onClick={onChange} />
      ))}
      {currentRecentList.length > 0 && (
        <LoadingMore
          className="loading"
          hasMore={currentRecentList.length < recentTotalNumber}
          loadMore={fetchMoreRecent}
        />
      )}
      {currentRecentList.length === 0 && <p className="no-data">{t('There is no recents')}</p>}
    </div>
  );
}
