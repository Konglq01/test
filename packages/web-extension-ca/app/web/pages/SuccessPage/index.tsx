import useLocationState from 'hooks/useLocationState';
import { useCallback, useEffect, useMemo } from 'react';
import { SuccessPageType } from 'types/UI';
import SuccessPageUI from './SuccessPageUI';

export default function SuccessPage() {
  const { state } = useLocationState<'login' | 'register'>();
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

  return <SuccessPageUI type={type} />;
}
