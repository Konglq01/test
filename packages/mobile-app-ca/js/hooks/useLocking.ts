import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import navigationService from 'utils/navigationService';

export default function useLocking() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    try {
      dispatch(setCredentials(undefined));
      navigationService.reset('SecurityLock');
    } catch (error) {
      console.log(error, '====error');
    }
  }, [dispatch]);
}
