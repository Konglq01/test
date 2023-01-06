import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import useLocationState from 'hooks/useLocationState';
import { useCallback, useEffect, useMemo } from 'react';
import { useEffectOnce } from 'react-use';
import { useAppDispatch } from 'store/Provider/hooks';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';
import { SuccessPageType } from 'types/UI';
import SuccessPageUI from './SuccessPageUI';

export default function SuccessPage() {
  const { state } = useLocationState<'login' | 'register'>();
  const dispatch = useAppDispatch();
  const wallet = useCurrentWallet();
  console.log(wallet, 'wallet===');
  const type = useMemo(() => {
    switch (state) {
      case 'register':
        return SuccessPageType.Created;
      case 'login':
      default:
        return SuccessPageType.Login;
    }
  }, [state]);

  const backCallBack = useCallback(() => {
    //
  }, []);

  useEffect(() => {
    window.history.pushState(null, '', document.URL);
    window.addEventListener('popstate', backCallBack, false);
    return () => {
      window.removeEventListener('popstate', backCallBack, false);
    };
  }, [backCallBack]);

  useEffectOnce(() => {
    dispatch(resetLoginInfoAction());
  });

  return <SuccessPageUI type={type} />;
}
