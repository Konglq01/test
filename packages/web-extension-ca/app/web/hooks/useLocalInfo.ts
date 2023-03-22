import useIpInfo from '@portkey-wallet/hooks/hooks-ca/useIpInfo';
import { useEffect } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { setCountryCodeAction } from 'store/reducers/loginCache/actions';

const useLocalInfo = () => {
  const ipInfo = useIpInfo();
  const dispatch = useAppDispatch();
  useEffect(() => {
    ipInfo &&
      dispatch(
        setCountryCodeAction({
          index: ipInfo.country[0],
          country: ipInfo,
        }),
      );
  }, [dispatch, ipInfo]);
};
export default useLocalInfo;
