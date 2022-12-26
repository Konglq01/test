import { useCallback, useState } from 'react';
import { authenticationReady } from 'utils/authentication';
import useEffectOnce from './useEffectOnce';

export default function useBiometricsReady() {
  const [biometricsReady, setBiometricsReady] = useState<boolean>();
  const getAuthenticationReady = useCallback(async () => {
    setBiometricsReady(await authenticationReady());
  }, [setBiometricsReady]);
  useEffectOnce(() => {
    getAuthenticationReady();
  });
  return biometricsReady;
}
