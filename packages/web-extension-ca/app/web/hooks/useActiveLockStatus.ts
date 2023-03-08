import useInterval from '@portkey-wallet/hooks/useInterval';
import { useCommonState } from '../store/Provider/hooks';
import { useActiveLockStatusAction } from '../utils/lib/serviceWorkerAction';

export const useActiveLockStatus = () => {
  const activeLockStatus = useActiveLockStatusAction();
  const { isPrompt } = useCommonState();
  const timer = useInterval(
    async () => {
      if (isPrompt) {
        timer.remove();
      } else {
        try {
          await activeLockStatus();
        } catch (err: any) {
          console.log('useActiveLockStatus error', err);
        }
      }
    },
    1000 * 40,
    [],
  );
  return () => timer.remove();
};
