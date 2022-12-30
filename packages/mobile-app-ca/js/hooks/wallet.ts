import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { ManagerInfo } from '@portkey/types/types-ca/wallet';
import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from 'store/hooks';
import { TimerResult } from 'utils/wallet';

type GetRegisterResultParams = {
  managerInfo: ManagerInfo;
  pin: string;
};
