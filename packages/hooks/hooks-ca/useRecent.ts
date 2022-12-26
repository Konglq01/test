import { addRecentContact } from '@portkey/store/store-ca/recent/slice';
import { RecentContactItemType } from '@portkey/types/types-ca/contact';
import { useAppCommonDispatch } from '..';
import { useAppCASelector } from './index';

export const useRecent = () => {
  const { recentContactList } = useAppCASelector(state => state.recent);
  const dispatch = useAppCommonDispatch();

  const addRecent = (recentContact: RecentContactItemType) => {
    dispatch(addRecentContact({ contact: recentContact }));
  };

  const upDateRecent = (recentContact: RecentContactItemType) => {
    if (!!recentContactList.find(ele => ele.id === recentContact.id)) {
      dispatch(addRecentContact({ contact: recentContact }));
    }
  };

  return {
    recentContactList: recentContactList ?? [],
    addRecent,
    upDateRecent,
  };
};
