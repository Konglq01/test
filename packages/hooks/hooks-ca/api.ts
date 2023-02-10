import { useMemo } from 'react';
import { useCurrentNetworkInfo } from './network';
import { useCurrentWalletInfo } from './wallet';
import aes from '@portkey/utils/aes';
import AElf from 'aelf-sdk';
import { setRefreshTokenConfig } from '@portkey/api/api-did/utils';

export function useRefreshTokenConfig(pin?: string) {
  const { caHash, AESEncryptPrivateKey } = useCurrentWalletInfo();
  const { apiUrl, connectUrl } = useCurrentNetworkInfo();
  useMemo(() => {
    if (!caHash || !AESEncryptPrivateKey || !pin) return;
    const account = AElf.wallet.getWalletByPrivateKey(aes.decrypt(AESEncryptPrivateKey, pin));
    setRefreshTokenConfig({
      account,
      caHash,
      connectUrl,
    });
  }, [AESEncryptPrivateKey, pin, caHash, connectUrl]);
}
