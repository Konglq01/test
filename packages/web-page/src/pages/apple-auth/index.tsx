import { useCallback, useEffect } from 'react';
import qs from 'query-string';

export default function AppleAuth() {
  const onSuccess = useCallback(async () => {
    const { id_token } = qs.parse(location.search);
    const response = {
      access_token: id_token,
    };
    window.portkey_did?.request({
      method: 'portkey_socialLogin',
      params: {
        response,
      },
    });
  }, []);
  useEffect(() => {
    onSuccess();
  }, []);
  return <div></div>;
}
