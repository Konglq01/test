import { useEffect } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { fetchGuardianListAsync } from '@portkey/store/store-ca/guardians/actions';

const useGuardiansList = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGuardianListAsync());
  }, [dispatch]);
};

export default useGuardiansList;
