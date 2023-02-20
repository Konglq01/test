import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import InternalMessage from 'messages/InternalMessage';
import { useDispatch } from 'react-redux';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { setIsPrompt } from 'store/reducers/common/slice';
import { useStorage } from 'hooks/useStorage';
import { fetchContactListAsync } from '@portkey/store/store-ca/contact/actions';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import { useEffectOnce } from 'react-use';
import { sleep } from '@portkey/utils';

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
    appDispatch(fetchContactListAsync());
  }, [appDispatch]);

  const noCheckRegister = useMemo(
    () =>
      location.pathname.includes('/login') ||
      location.pathname.includes('/register') ||
      location.pathname.includes('/success-page') ||
      location.pathname === '/permission',
    [location.pathname],
  );

  const isRegisterPage = useMemo(
    () =>
      location.pathname.includes('/register') ||
      location.pathname.includes('/success-page') ||
      ((location.pathname.includes('/query-page') || location.pathname.includes('/login')) && pageType === 'Popup'),
    [location.pathname, pageType],
  );

  const locked = useStorage('locked');

  const _sleep = useCallback(async () => {
    // TODO This is a bug
    await sleep(1000);
    return 'Extension error';
  }, []);

  const getPassword = useCallback(async () => {
    try {
      const res = await Promise.race([
        InternalMessage.payload(PortkeyMessageTypes.CHECK_WALLET_STATUS).send(),
        _sleep(),
      ]);
      console.log(res, 'CHECK_WALLET_STATUS');
      if (typeof res !== 'object') return chrome.runtime.reload(); // navigate('/unlock');
      const detail = (res as any)?.data;
      if (detail?.registerStatus === 'Registered') {
        detail?.privateKey && dispatch(setPasswordSeed(detail.privateKey));
        !detail?.privateKey && navigate('/unlock');
      } else if (detail?.registerStatus === 'registeredNotGetCaAddress') {
        navigate('/query-page');
      } else {
        navigate('/register/start');
      }
    } catch (error) {
      console.error(error, 'CHECK_WALLET_STATUS==error');
    }
  }, [_sleep, dispatch, navigate]);

  const goQueryPage = useCallback(async () => {
    const registerStatus = await getLocalStorage('registerStatus');
    if (!location.pathname.includes('/query-page') && registerStatus === 'registeredNotGetCaAddress')
      return navigate('/query-page');
  }, [location.pathname, navigate]);

  useEffectOnce(() => {
    goQueryPage();
  });

  const checkRegisterHandler = useCallback(async () => {
    const registerStatus = await getLocalStorage('registerStatus');
    if (registerStatus !== 'Registered' && pageType === 'Popup') {
      return InternalMessage.payload(PortkeyMessageTypes.REGISTER_WALLET, {}).send();
    }
    if (noCheckRegister) return;
    if (isRegisterPage) return InternalMessage.payload(PortkeyMessageTypes.REGISTER_WALLET, {}).send();
    getPassword();
  }, [pageType, noCheckRegister, isRegisterPage, getPassword]);

  useEffect(() => {
    if (location.pathname.includes('/test')) return;
    if (locked && !noCheckRegister && !isRegisterPage) return navigate('/unlock');
    checkRegisterHandler();
  }, [isRegisterPage, locked, noCheckRegister, navigate, getPassword, checkRegisterHandler, location.pathname]);

  return <>{children}</>;
}
