import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import LockManager from 'utils/LockManager';
import useEffectOnce from 'hooks/useEffectOnce';
import usePrevious from 'hooks/usePrevious';
import { useSettings, useWallet } from 'hooks/store';
interface AppListenerProps {
  children: ReactElement;
}
const isBackUpTime = 10 * 60;
const AppListener: React.FC<AppListenerProps> = props => {
  const lockManager = useRef<LockManager>();
  const { walletInfo } = useWallet();
  const { autoLockingTime } = useSettings();

  const lockingTime = useMemo(() => {
    if (!walletInfo?.isBackup) return isBackUpTime;
    if (autoLockingTime === 0) return 0.5;
    return autoLockingTime;
  }, [autoLockingTime, walletInfo?.isBackup]);

  const prevLockingTime = usePrevious(lockingTime);

  useEffect(() => {
    if (prevLockingTime !== lockingTime) lockManager.current?.updateLockTime(lockingTime * 1000);
  }, [lockingTime, prevLockingTime]);

  useEffectOnce(() => {
    lockManager.current = new LockManager(lockingTime * 1000);
    return () => lockManager.current?.stopListening();
  });

  return props.children;
};

export default AppListener;
