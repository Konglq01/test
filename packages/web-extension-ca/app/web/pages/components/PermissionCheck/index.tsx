import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import InternalMessage from 'messages/InternalMessage';
import { useDispatch } from 'react-redux';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { setIsPrompt } from 'store/reducers/common/slice';
import { useStorage } from 'hooks/useStorage';
import { fetchContractListAsync } from '@portkey/store/store-ca/contact/actions';

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

  useEffect(() => {
    appDispatch(fetchContractListAsync());
  }, [appDispatch]);

  const noCheckPage = useMemo(
    () =>
      location.pathname.includes('/login') ||
      location.pathname.includes('/register') ||
      location.pathname === '/permission',
    [location.pathname],
  );

  const isRegisterPage = useMemo(
    () =>
      location.pathname.includes('/register') ||
      ((location.pathname.includes('/blank-page') || location.pathname.includes('/login')) && pageType === 'Popup'),
    [location.pathname, pageType],
  );

  const locked = useStorage('locked');

  const getPassword = useCallback(async () => {
    try {
      if (noCheckPage) return;
      if (isRegisterPage) return InternalMessage.payload(PortkeyMessageTypes.REGISTER_WALLET, {}).send();
      InternalMessage.payload(PortkeyMessageTypes.CHECK_WALLET_STATUS)
        .send()
        .then((res) => {
          console.log(res, 'CHECK_WALLET_STATUS');
          const detail = res?.data;
          if (detail?.registerStatus === 'Registered') {
            detail?.privateKey && dispatch(setPasswordSeed(detail.privateKey));
            !detail?.privateKey && navigate('/unlock');
          } else if (detail?.registerStatus === 'registeredNotGetCaAddress') {
            navigate('/blank-page');
          } else {
            navigate('/register/start');
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
