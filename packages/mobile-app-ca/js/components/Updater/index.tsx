import { request } from '@portkey/api/api-did';
import { useChainListFetch } from '@portkey/hooks/hooks-ca/chainList';
import { service } from 'api/utils';
import { usePin } from 'hooks/store';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import { useMemo } from 'react';
import { useRefreshTokenConfig } from '@portkey/hooks/hooks-ca/api';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import useLocking from 'hooks/useLocking';
export default function Updater() {
  // FIXME: delete language
  const { changeLanguage } = useLanguage();
  useEffectOnce(() => {
    changeLanguage('en');
  });
  useChainListFetch();
  const { apiUrl } = useCurrentNetworkInfo();
  const pin = usePin();
  const onLocking = useLocking();
  useRefreshTokenConfig(pin);
  useMemo(() => {
    request.set('baseURL', apiUrl);
    if (service.defaults.baseURL !== apiUrl) {
      service.defaults.baseURL = apiUrl;
    }
  }, [apiUrl]);

  useMemo(() => {
    request.setLockCallBack(onLocking);
  }, [onLocking]);
  return null;
}
