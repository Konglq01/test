import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { usePreventHardwareBack } from 'hooks/useHardwareBack';
import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useAppDispatch } from 'store/Provider/hooks';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';
import { SuccessPageType } from 'types/UI';
import SuccessPageUI from './SuccessPageUI';

export default function SuccessPage() {
  const { pathname } = useLocation();
  const state = useMemo(() => pathname.split('/')[1], [pathname]);
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

  usePreventHardwareBack();

  useEffectOnce(() => {
    dispatch(resetLoginInfoAction());
  });

  return <SuccessPageUI type={type} />;
}
