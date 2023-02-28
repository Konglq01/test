import useInterval from '@portkey/hooks/useInterval';
import { useCommonState } from 'store/Provider/hooks';
import { useActiveLockStatusAction } from 'utils/lib/serviceWorkerAction';

export const useActiveLockStatus = () => {
  const activeLockStatus = useActiveLockStatusAction();
  const { isPrompt } = useCommonState();
  const timer = useInterval(
    () => {
      if (isPrompt) {
        timer.remove();
      } else {
        try {
          activeLockStatus();
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
