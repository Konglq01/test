import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';

export function usePreventHardwareBack() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => {
      backHandler.remove();
    };
  }, []);
}

export function useHardwareBack(callback: () => void) {
  const savedCallback = useRef<() => void>();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      savedCallback.current?.();
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);
}
