import { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { fetchGuardianListAsync } from '@portkey-wallet/store/store-ca/guardians/actions';

export const useGuardianList = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchGuardianListAsync());
  }, [dispatch]);
};
