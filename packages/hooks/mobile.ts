import { authenticationReady } from '@portkey/utils/mobile/authentication';
import { useEffect, useRef, useCallback } from 'react';
import { BackHandler } from 'react-native';
import { setBiometrics } from 'store/user/actions';
import { useAppCommonDispatch } from './index';
export function useHardwareBackPress(callback?: () => boolean) {
  const savedCallback = useRef<() => boolean>();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return savedCallback.current?.();
    });
    return () => {
      backHandler.remove();
    };
  }, []);
}

export function usePreventHardwareBack(callback?: () => void) {
  const savedCallback = useRef<() => void>();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useHardwareBackPress(() => {
    savedCallback.current?.();
    return true;
  });
}

export function useSetBiometrics() {
  const dispatch = useAppCommonDispatch();
  return useCallback(async (value: boolean) => {
    if (value) {
      const isReady = await authenticationReady();
      if (!isReady) throw new Error('biometrics is not ready');
    }
    dispatch(setBiometrics(value));
  }, []);
}
