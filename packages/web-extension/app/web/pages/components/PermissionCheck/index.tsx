import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import InternalMessage from 'messages/InternalMessage';
import { useDispatch } from 'react-redux';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { setIsPrompt } from 'store/reducers/common/slice';
import { useStorage } from 'hooks/useStorage';

export default function PermissionCheck({
  children,
  pageType = 'Popup',
}: {
  children: ReactNode;
  pageType?: 'Popup' | 'Prompt';
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(setIsPrompt(pageType === 'Prompt'));
  }, [appDispatch, pageType]);

  const noCheckPage = useMemo(
    () =>
      location.pathname.includes('/success-page') ||
      location.pathname.includes('/register') ||
      location.pathname === '/permission',
    [location.pathname],
  );

  const isRegisterPage = useMemo(
    () => location.pathname.includes('/register') && pageType === 'Popup',
    [location.pathname, pageType],
  );

  const locked = useStorage('locked');

  const getPassword = useCallback(async () => {
    try {
      if (isRegisterPage) return InternalMessage.payload(PortkeyMessageTypes.REGISTER_WALLET, {}).send();
      if (noCheckPage) return;
      InternalMessage.payload(PortkeyMessageTypes.CHECK_WALLET_STATUS)
        .send()
        .then((res) => {
          console.log(res, 'CHECK_WALLET_STATUS');
          const detail = res?.data;
          if (detail?.registerStatus === 'Registered') {
            detail?.privateKey && dispatch(setPasswordSeed(detail.privateKey));
            !detail?.privateKey && navigate('/unlock');
          } else if (detail.registerStatus === 'registrationNotBackedUp') {
            navigate('/register/backup');
            return;
          } else {
            navigate('/register/create');
            return;
          }
        });
    } catch (error) {
      console.error(error, 'CHECK_WALLET_STATUS==error');
    }
  }, [dispatch, isRegisterPage, navigate, noCheckPage]);

  useEffect(() => {
    if (locked && !noCheckPage && !isRegisterPage) return navigate('/unlock');
    getPassword();
  }, [getPassword, isRegisterPage, locked, navigate, noCheckPage]);

  return <>{children}</>;
}
