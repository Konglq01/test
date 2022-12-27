import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { ManagerInfo } from '@portkey/types/types-ca/wallet';
import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from 'store/hooks';
import { intervalGetRegisterResult, TimerResult } from 'utils/wallet';

type GetRegisterResultParams = {
  managerInfo: ManagerInfo;
  pin: string;
};
export function useIntervalGetRegisterResult() {
  const dispatch = useAppDispatch();
  const { apiUrl } = useCurrentNetworkInfo();
  const timer = useRef<TimerResult>();
  useEffect(() => {
    return () => {
      timer.current?.remove();
    };
  });
  return useCallback(
    (params: GetRegisterResultParams) => {
      timer.current = intervalGetRegisterResult({
        ...params,
        apiUrl,
        dispatch,
      });
    },
    [apiUrl, dispatch],
  );
}
