import { authenticationReady, touchAuth } from './authentication';
import { isIos } from './device';
import secureStore, { SecureKeys } from './secureStore';
export async function setSecureStoreItem(key: typeof SecureKeys[number] = 'Password', value: string) {
  const isReady = await authenticationReady();
  if (!isReady) throw { message: 'biometrics is not ready' };
  // authentication ready secure store password
  if (isIos) {
    // iOS manually open authenticate
    const enrolled = await touchAuth();
    if (!enrolled.success) throw { message: enrolled.warning || enrolled.error };
  }
  // android secureStore requires authenticate by default
  await secureStore.setItemAsync(key, value);
}
