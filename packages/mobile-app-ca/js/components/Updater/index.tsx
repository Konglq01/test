import myServer from '@portkey/api/server';
import { useChainListFetch } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentApiUrl } from '@portkey/hooks/hooks-ca/network';
import { service } from 'api/utils';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import { useMemo } from 'react';

export default function Updater() {
  // FIXME: delete language
  const { changeLanguage } = useLanguage();
  useEffectOnce(() => {
    changeLanguage('en');
  });
  useChainListFetch();

  const apiUrl = useCurrentApiUrl();
  useMemo(() => {
    myServer.set('baseURL', apiUrl);
    if (service.defaults.baseURL !== apiUrl) {
      service.defaults.baseURL = apiUrl;
    }
  }, [apiUrl]);

  return null;
}
