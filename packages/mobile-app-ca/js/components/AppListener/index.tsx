import React, { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';
import LockManager from 'utils/LockManager';
import useEffectOnce from 'hooks/useEffectOnce';
import usePrevious from 'hooks/usePrevious';
import { useSettings } from 'hooks/store';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { isIos } from '@portkey-wallet/utils/mobile/device';
import { AppState, AppStateStatus } from 'react-native';
import { useCheckUpdate } from 'hooks/device';
let changeTime = Date.now();
interface AppListenerProps {
  children: ReactElement;
}
const AutoLockUpTime = 5 * 60;

const AppListener: React.FC<AppListenerProps> = props => {
  const lockManager = useRef<LockManager>();
  const { walletInfo } = useCurrentWallet();
  const { autoLockingTime } = useSettings();
  const lockingTime = useMemo(() => {
    if (!walletInfo?.address || (walletInfo.address && !walletInfo.AELF)) return AutoLockUpTime;
    if (autoLockingTime === 0 && !isIos) return 0.5;
    return autoLockingTime;
  }, [autoLockingTime, walletInfo.AELF, walletInfo.address]);
  const prevLockingTime = usePrevious(lockingTime);
  const checkUpdate = useCheckUpdate();

  useEffect(() => {
    if (prevLockingTime !== lockingTime) lockManager.current?.updateLockTime(lockingTime * 1000);
  }, [lockingTime, prevLockingTime]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      const currentTime = Date.now();
      if (nextAppState === 'active') {
        if (currentTime > changeTime + 1000) checkUpdate();
      }
      if (nextAppState === 'background') {
        changeTime = currentTime;
      }
    },
    [checkUpdate],
  );
  useEffectOnce(() => {
    const timer = setTimeout(checkUpdate, 1000);
    const listener = AppState.addEventListener('change', handleAppStateChange);
    lockManager.current = new LockManager(lockingTime * 1000);
    return () => {
      timer && clearTimeout(timer);
      lockManager.current?.stopListening();
      listener.remove();
    };
  });

  return props.children;
};

export default AppListener;
