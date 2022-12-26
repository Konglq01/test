import { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { fetchVerifierListAsync } from '@portkey/store/store-ca/guardians/actions';

const useVerifierList = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchVerifierListAsync());
  }, [dispatch]);
};

export default useVerifierList;
