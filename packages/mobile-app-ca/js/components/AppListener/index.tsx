import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import LockManager from 'utils/LockManager';
import useEffectOnce from 'hooks/useEffectOnce';
import usePrevious from 'hooks/usePrevious';
import { useSettings } from 'hooks/store';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { isIos } from '@portkey-wallet/utils/mobile/device';
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
