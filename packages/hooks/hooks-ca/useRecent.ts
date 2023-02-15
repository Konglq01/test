import { addRecentContact } from '@portkey/store/store-ca/recent/slice';
import { RecentContactItemType } from '@portkey/types/types-ca/contact';
import { useAppCommonDispatch } from '..';
import { useAppCASelector } from './index';

export const useRecent = () => {
  const { recentContactList } = useAppCASelector(state => state.recent);
  const dispatch = useAppCommonDispatch();

  return {
    recentContactList: recentContactList ?? [],
  };
};
